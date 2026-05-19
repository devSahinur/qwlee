"use client";
import BlogCard from "@/components/Blogs/BlogCard";
import Loading from "@/components/CustomCreate/Loading";
import Breadcrumb from "@/components/Layout/Breadcrumb";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import { useGetAllBlogsQuery } from "../redux/features/getAllBlogs";

function Blogs() {
  const { data, isLoading, isError, error } = useGetAllBlogsQuery();
  const blogsData = data?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <Loading />;
  } else if (!isLoading && isError && error) {
    content = (
      <h3 className="font-semibold text-rose-500 text-center py-5">
        Something went wrong
      </h3>
    );
  } else if (!isError && !isError && blogsData?.length === 0) {
    content = (
      <h3 className="font-semibold text-rose-500 text-center py-5">
        No blogs found
      </h3>
    );
  } else if (!isError && !isError && blogsData?.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogsData?.map((item) => (
          <BlogCard key={item?.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <>
      <PrimaryLayout>
        <Breadcrumb
          title={"Qwlee All Blog"}
          pathTitle={"Blog"}
          path={"/blogs"}
        />
        <div className="container py-[100px]">{content}</div>
      </PrimaryLayout>
    </>
  );
}

export default Blogs;
