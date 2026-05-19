// Back-compat shim. SecondaryLayout used to render a legacy green-bar
// header — but that header lacked the Switch to Selling/Buying toggle
// and the redesigned categories dropdown, so pages that used it
// (notably /gig/[slug]) suddenly looked broken and felt like the menu
// had disappeared. Forward to PrimaryLayout so every public page shares
// the same TopNav.

import PrimaryLayout from "./PrimaryLayout";

export default function SecondaryLayout({ children }) {
  return <PrimaryLayout>{children}</PrimaryLayout>;
}
