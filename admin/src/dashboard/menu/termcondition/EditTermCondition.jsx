import {
  useAddTermConditionMutation,
  useGetTermConditonQuery,
} from "../../../redux/api/apiSlice";
import LegalEditor from "../../../common/LegalEditor";

export default function EditTermCondition() {
  const { data, isFetching } = useGetTermConditonQuery();
  const [save] = useAddTermConditionMutation();
  const initial = data?.data?.attributes?.[0]?.content || "";
  return (
    <LegalEditor
      title="Edit terms & conditions"
      subtitle="Changes go live the moment you save."
      initialContent={initial}
      loading={isFetching}
      onSave={(payload) => save(payload)}
      backPath="/dashboard/terms"
    />
  );
}
