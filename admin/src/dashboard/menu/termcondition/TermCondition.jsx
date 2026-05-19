import { useGetTermConditonQuery } from "../../../redux/api/apiSlice";
import LegalPage from "../../../common/LegalPage";

export default function TermCondition() {
  const { data, isFetching } = useGetTermConditonQuery();
  const content = data?.data?.attributes?.[0]?.content || "";
  return (
    <LegalPage
      title="Terms & conditions"
      subtitle="The agreement every user accepts before signing up."
      content={content}
      editPath="/dashboard/editTermconditon"
      loading={isFetching}
    />
  );
}
