import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import SupportThread from "@/components/Support/SupportThread";

export const metadata = { title: "Ticket | Qwlee" };

export default async function SupportTicketPage() {
  return (
    <PrimaryLayout>
      <SupportThread />
    </PrimaryLayout>
  );
}
