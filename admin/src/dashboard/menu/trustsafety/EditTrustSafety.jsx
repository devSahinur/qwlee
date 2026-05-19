import {
  useAddTrustSafetyMutation,
  useGetTrustSafetyQuery,
} from "../../../redux/api/apiSlice";
import LegalEditor from "../../../common/LegalEditor";

export default function EditTrustSafety() {
  const { data, isFetching } = useGetTrustSafetyQuery();
  const [save] = useAddTrustSafetyMutation();
  const initial = data?.data?.attributes?.[0]?.content || "";
  return (
    <LegalEditor
      title="Edit trust & safety"
      subtitle="Changes go live the moment you save."
      initialContent={initial}
      loading={isFetching}
      onSave={(payload) => save(payload)}
      backPath="/dashboard/trustsafety"
    />
  );
}
