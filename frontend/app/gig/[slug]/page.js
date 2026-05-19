// Next 16 made dynamic-route `params` an async value — must be awaited
// before destructuring in both the page component and generateMetadata.

import GigDetails from "@/components/Gig/GigDetails/GigDetails";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import { base } from "@/lib/constant";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`${base}/v1/gig?slug=${slug}`, { cache: "no-store" });
    const data = await res.json();
    const gig = data?.data?.attributes?.results?.[0];
    // Layout exports `template: "%s · Qwlee"` — don't repeat the brand.
    const title = gig?.title || "Gig";
    const description = gig?.description?.slice(0, 160) || `View this gig on Qwlee.`;
    return {
      title,
      description,
      openGraph: { title, description },
      twitter: { title, description },
    };
  } catch {
    return { title: "Gig" };
  }
}

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <PrimaryLayout>
      <GigDetails slug={slug} />
    </PrimaryLayout>
  );
}
