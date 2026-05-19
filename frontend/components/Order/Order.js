"use client";
// /order — one unified manage-orders page. Whether you see Buyer orders
// or Seller orders is driven by the active view mode (set via the navbar
// Switch to Selling / Switch to Buying toggle), not by user.role. This
// matches Fiverr's behaviour: one account, two views.

import ManageOrders from "./ManageOrders";

export default function Order() {
  return <ManageOrders />;
}
