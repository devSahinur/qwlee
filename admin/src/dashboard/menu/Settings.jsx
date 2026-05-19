// Settings — admin landing page that links out to the legal pages and
// change-password flow. The legacy big modal-driven version is gone;
// each row is a card that navigates somewhere real.

import { Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";
import { LuShield, LuFileText, LuLock, LuUser, LuBadgeCheck } from "react-icons/lu";
import PageHeader from "../../common/PageHeader";

const SECTIONS = [
  {
    title: "Account",
    items: [
      { to: "/dashboard/personalinfo", label: "Personal information", icon: LuUser, desc: "Name, email, profile photo." },
      { to: "/forgotpassword", label: "Change password", icon: LuLock, desc: "Reset the password used to sign in." },
    ],
  },
  {
    title: "Legal & policies",
    items: [
      { to: "/dashboard/privacy", label: "Privacy policy", icon: LuShield, desc: "What we collect and how we use it." },
      { to: "/dashboard/terms", label: "Terms & conditions", icon: LuFileText, desc: "The agreement users accept." },
      { to: "/dashboard/trustsafety", label: "Trust & safety", icon: LuBadgeCheck, desc: "How we keep the marketplace safe." },
    ],
  },
];

export default function Settings() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and the platform's published policies."
      />

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-2 px-1">
              {section.title}
            </h2>
            <div className="bg-white border border-ink-200 rounded-2xl shadow-card divide-y divide-ink-100 overflow-hidden">
              {section.items.map((item) => (
                <Link
                  to={item.to}
                  key={item.to}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-ink-50/60 transition"
                >
                  <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink-900">{item.label}</div>
                    <div className="text-xs text-ink-500">{item.desc}</div>
                  </div>
                  <IoChevronForward className="text-ink-300" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
