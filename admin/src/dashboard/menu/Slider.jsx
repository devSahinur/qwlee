// Banner slider — admin view. Gallery of uploaded slides with inline
// delete and an upload card that opens AddSliderImage.

import { useState } from "react";
import { TbPlus, TbTrash } from "react-icons/tb";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import {
  useDeleteImageMutation,
  useGetIamageQuery,
} from "../../redux/api/apiSlice";

import PageHeader from "../../common/PageHeader";
import Card from "../../common/Card";
import Button from "../../common/Button";
import AddSliderImage from "./AddSliderImage";
import getImageUrl from "../../utils/getImageUrl";

export default function Slider() {
  const { data, isLoading } = useGetIamageQuery();
  const [deleteImage] = useDeleteImageMutation();
  const [addOpen, setAddOpen] = useState(false);

  const items =
    data?.data?.attributes?.results ||
    data?.attributes?.results ||
    data?.results ||
    [];

  async function handleDelete(id) {
    const ok = await Swal.fire({
      title: "Remove banner?",
      text: "This image will no longer appear on the homepage slider.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E11D48",
      confirmButtonText: "Remove",
    });
    if (!ok.isConfirmed) return;
    const res = await deleteImage(id);
    if (res?.error) toast.error("Delete failed");
    else toast.success("Banner removed");
  }

  return (
    <div>
      <PageHeader
        title="Banner slider"
        subtitle={`${items.length} image${items.length === 1 ? "" : "s"} live on the homepage.`}
        actions={
          <Button iconLeft={TbPlus} onClick={() => setAddOpen(true)}>
            Upload banner
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[16/7] bg-white border border-ink-200 rounded-2xl shadow-card animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <p className="text-ink-700 font-medium">No banners yet</p>
            <p className="text-sm text-ink-500 mt-1">
              Upload at least one image to populate the homepage slider.
            </p>
            <Button iconLeft={TbPlus} className="mt-4" onClick={() => setAddOpen(true)}>
              Upload banner
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((img) => (
            <div
              key={img._id || img.id}
              className="relative bg-white border border-ink-200 rounded-2xl shadow-card overflow-hidden group"
            >
              <div className="aspect-[16/7] bg-ink-100">
                <img
                  src={getImageUrl(img.image)}
                  alt="banner"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-end justify-end p-3 opacity-0 group-hover:opacity-100">
                <Button
                  variant="danger"
                  size="sm"
                  iconLeft={TbTrash}
                  onClick={() => handleDelete(img._id || img.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddSliderImage open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
