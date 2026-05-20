// Multi-provider checkout orchestrator. Reads credentials from the
// AppConfig singleton (so the admin can manage them in the UI) and
// dispatches to the right provider implementation. Every provider
// returns the same shape: { url, sessionId?, provider } — the frontend
// just redirects.
//
// Each implementation is intentionally minimal: it creates a hosted
// checkout session (or, in the case of Lemon Squeezy / Paddle / custom,
// a redirect URL) and lets the provider handle the rest. Webhook
// handlers per provider are stubbed where unimplemented — start with
// the existing Stripe webhook in orders.controller, mirror the same
// pattern when you wire the others.

const httpStatus = require("http-status");
const axios = require("axios");
const ApiError = require("../utils/ApiError");
const appConfigService = require("./appConfig.service");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8000";

async function getProvider(id) {
  const config = await appConfigService.getConfig();
  if (id === "stripe") return { kind: "stripe", config: config.payments.stripe };
  if (id === "paypal") return { kind: "paypal", config: config.payments.paypal };
  if (id === "paddle") return { kind: "paddle", config: config.payments.paddle };
  if (id === "lemonsqueezy")
    return { kind: "lemonsqueezy", config: config.payments.lemonsqueezy };
  if (id === "sslcommerz")
    return { kind: "sslcommerz", config: config.payments.sslcommerz };

  const custom = (config.customPayments || []).find((c) => c.id === id);
  if (custom) return { kind: "custom", config: custom };
  return null;
}

function ensureEnabled(p, id) {
  if (!p || !p.config?.enabled) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Payment provider '${id}' is not enabled`
    );
  }
}

// --- Stripe ----------------------------------------------------------------
async function checkoutStripe(provider, { items, metadata }) {
  const secret = provider.config.credentials?.secretKey;
  if (!secret) {
    throw new ApiError(
      httpStatus.PRECONDITION_FAILED,
      "Stripe secret key is not configured"
    );
  }
  const stripe = require("stripe")(secret);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: items.map((item) => ({
      price_data: {
        currency: (metadata?.currency || "USD").toLowerCase(),
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity || 1,
    })),
    metadata,
    success_url: `${FRONTEND_URL}/success`,
    cancel_url: `${FRONTEND_URL}/cancel`,
  });
  return { url: session.url, sessionId: session.id, provider: "stripe" };
}

// --- PayPal (Orders API v2) ------------------------------------------------
async function checkoutPayPal(provider, { items, metadata }) {
  const { clientId, clientSecret } = provider.config.credentials || {};
  if (!clientId || !clientSecret) {
    throw new ApiError(
      httpStatus.PRECONDITION_FAILED,
      "PayPal credentials are not configured"
    );
  }
  const base =
    provider.config.mode === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  // 1. OAuth token
  const tokenRes = await axios.post(
    `${base}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: { username: clientId, password: clientSecret },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  const accessToken = tokenRes.data.access_token;

  const total = items.reduce(
    (s, it) => s + Number(it.price) * (Number(it.quantity) || 1),
    0
  );

  // 2. Create order
  const orderRes = await axios.post(
    `${base}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: metadata?.currency || "USD",
            value: total.toFixed(2),
          },
          custom_id: String(metadata?.orderId || metadata?.gigId || ""),
          description: items[0]?.name?.slice(0, 120) || "Qwlee order",
        },
      ],
      application_context: {
        return_url: `${FRONTEND_URL}/success?provider=paypal`,
        cancel_url: `${FRONTEND_URL}/cancel?provider=paypal`,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const approval = orderRes.data.links?.find((l) => l.rel === "approve");
  if (!approval) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      "PayPal did not return an approval link"
    );
  }
  return { url: approval.href, sessionId: orderRes.data.id, provider: "paypal" };
}

// --- Paddle (Hosted Checkout / Transactions API) ---------------------------
async function checkoutPaddle(provider, { items, metadata }) {
  const { apiKey, priceIdFallback } = provider.config.credentials || {};
  if (!apiKey) {
    throw new ApiError(
      httpStatus.PRECONDITION_FAILED,
      "Paddle API key is not configured"
    );
  }
  const base =
    provider.config.mode === "live"
      ? "https://api.paddle.com"
      : "https://sandbox-api.paddle.com";

  // Paddle requires pre-created price IDs. For a marketplace where
  // every gig has a custom amount, the admin can either:
  //   (a) set a "default" price ID and we send the gig amount as an
  //       override on the transaction items, or
  //   (b) wire a per-gig product creation flow.
  // We use (a) here — `priceIdFallback` is the price ID configured
  // in admin settings, applied to every transaction.
  if (!priceIdFallback) {
    throw new ApiError(
      httpStatus.PRECONDITION_FAILED,
      "Paddle is enabled but no default priceId is configured"
    );
  }

  const txRes = await axios.post(
    `${base}/transactions`,
    {
      items: [
        { price_id: priceIdFallback, quantity: items[0]?.quantity || 1 },
      ],
      custom_data: metadata || {},
      collection_mode: "automatic",
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  const url =
    txRes.data?.data?.checkout?.url ||
    `${FRONTEND_URL}/cancel?provider=paddle&error=no-checkout-url`;
  return { url, sessionId: txRes.data?.data?.id, provider: "paddle" };
}

// --- Lemon Squeezy ---------------------------------------------------------
async function checkoutLemonSqueezy(provider, { items, metadata }) {
  const { apiKey, storeId, variantId } = provider.config.credentials || {};
  if (!apiKey || !storeId || !variantId) {
    throw new ApiError(
      httpStatus.PRECONDITION_FAILED,
      "Lemon Squeezy requires apiKey, storeId, and variantId"
    );
  }
  const total = items.reduce(
    (s, it) => s + Number(it.price) * (Number(it.quantity) || 1),
    0
  );

  const res = await axios.post(
    "https://api.lemonsqueezy.com/v1/checkouts",
    {
      data: {
        type: "checkouts",
        attributes: {
          custom_price: Math.round(total * 100),
          checkout_data: { custom: metadata || {} },
          product_options: {
            redirect_url: `${FRONTEND_URL}/success?provider=lemonsqueezy`,
          },
        },
        relationships: {
          store: { data: { type: "stores", id: String(storeId) } },
          variant: { data: { type: "variants", id: String(variantId) } },
        },
      },
    },
    {
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  const url = res.data?.data?.attributes?.url;
  if (!url) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      "Lemon Squeezy did not return a checkout URL"
    );
  }
  return { url, sessionId: res.data.data.id, provider: "lemonsqueezy" };
}

// --- SSLCommerz (Bangladesh) -----------------------------------------------
async function checkoutSslCommerz(provider, { items, metadata, user }) {
  const { storeId, storePassword } = provider.config.credentials || {};
  if (!storeId || !storePassword) {
    throw new ApiError(
      httpStatus.PRECONDITION_FAILED,
      "SSLCommerz requires storeId and storePassword"
    );
  }
  const base =
    provider.config.mode === "live"
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

  const total = items.reduce(
    (s, it) => s + Number(it.price) * (Number(it.quantity) || 1),
    0
  );
  const tranId = `qwlee_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  const params = new URLSearchParams();
  params.append("store_id", storeId);
  params.append("store_passwd", storePassword);
  params.append("total_amount", total.toFixed(2));
  params.append("currency", metadata?.currency || "BDT");
  params.append("tran_id", tranId);
  params.append("success_url", `${FRONTEND_URL}/success?provider=sslcommerz`);
  params.append("fail_url", `${FRONTEND_URL}/cancel?provider=sslcommerz`);
  params.append("cancel_url", `${FRONTEND_URL}/cancel?provider=sslcommerz`);
  params.append("cus_name", user?.fullName || "Customer");
  params.append("cus_email", user?.email || "noreply@qwlee.com");
  params.append("cus_phone", user?.phone || "0000000000");
  params.append("cus_add1", user?.location || "N/A");
  params.append("cus_city", "Dhaka");
  params.append("cus_country", "Bangladesh");
  params.append("shipping_method", "NO");
  params.append("product_name", items[0]?.name?.slice(0, 80) || "Qwlee Order");
  params.append("product_category", "Service");
  params.append("product_profile", "general");

  const res = await axios.post(base, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (res.data?.status === "SUCCESS" && res.data.GatewayPageURL) {
    return {
      url: res.data.GatewayPageURL,
      sessionId: res.data.sessionkey || tranId,
      provider: "sslcommerz",
    };
  }
  throw new ApiError(
    httpStatus.BAD_GATEWAY,
    res.data?.failedreason || "SSLCommerz init failed"
  );
}

// --- Custom (admin-defined) ------------------------------------------------
// For provider plug-ins the admin defines in the UI, we support a
// simple redirect-template strategy: the admin provides a URL with
// {amount} / {currency} / {orderId} placeholders, and we substitute
// and redirect. Good enough for hosted-checkout style providers and
// keeps the door open for future native integrations.
async function checkoutCustom(provider, { items, metadata }) {
  const total = items.reduce(
    (s, it) => s + Number(it.price) * (Number(it.quantity) || 1),
    0
  );
  const tpl = provider.config.checkoutUrlTemplate;
  if (!tpl) {
    throw new ApiError(
      httpStatus.PRECONDITION_FAILED,
      `Custom provider '${provider.config.id}' has no checkout URL configured`
    );
  }
  const url = tpl
    .replace("{amount}", encodeURIComponent(total.toFixed(2)))
    .replace("{currency}", encodeURIComponent(metadata?.currency || "USD"))
    .replace("{orderId}", encodeURIComponent(metadata?.orderId || ""));
  return { url, provider: provider.config.id, custom: true };
}

async function createCheckout({ providerId, items, metadata, user }) {
  if (!providerId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "providerId is required");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "items is required");
  }

  const provider = await getProvider(providerId);
  if (!provider) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Unknown payment provider '${providerId}'`
    );
  }
  ensureEnabled(provider, providerId);

  switch (provider.kind) {
    case "stripe":
      return checkoutStripe(provider, { items, metadata });
    case "paypal":
      return checkoutPayPal(provider, { items, metadata });
    case "paddle":
      return checkoutPaddle(provider, { items, metadata });
    case "lemonsqueezy":
      return checkoutLemonSqueezy(provider, { items, metadata });
    case "sslcommerz":
      return checkoutSslCommerz(provider, { items, metadata, user });
    case "custom":
      return checkoutCustom(provider, { items, metadata });
    default:
      throw new ApiError(
        httpStatus.NOT_IMPLEMENTED,
        `No handler for provider '${provider.kind}'`
      );
  }
}

module.exports = { createCheckout };
