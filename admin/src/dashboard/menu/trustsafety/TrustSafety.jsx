import { useGetTrustSafetyQuery } from "../../../redux/api/apiSlice";
import LegalPage from "../../../common/LegalPage";

export default function TrustSafety() {
  const { data, isFetching } = useGetTrustSafetyQuery();
  const content = data?.data?.attributes?.[0]?.content || "";
  return (
    <LegalPage
      title="Trust & safety"
      subtitle="How Qwlee keeps buyers and sellers safe."
      content={content}
      editPath="/dashboard/editsafetytrust"
      loading={isFetching}
    />
  );
}
