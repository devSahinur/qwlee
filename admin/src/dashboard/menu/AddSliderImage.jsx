// AddSliderImage — modal version for use inside Slider page.
//
// Was previously a full-page form; now a clean drop zone modal so it
// composes with the new Slider gallery.

import { useState } from "react";
import { Modal as RModal } from "react-responsive-modal";
import toast from "react-hot-toast";
import { TbCameraPlus, TbUpload } from "react-icons/tb";

import { useAddSliderImageMutation } from "../../redux/api/apiSlice";
import Button from "../../common/Button";

import "react-responsive-modal/styles.css";

export default function AddSliderImage({ open, onClose }) {
  const [addImage, { isLoading }] = useAddSliderImageMutation();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }
  function reset() {
    setFile(null);
    setPreviewUrl("");
  }

  async function handleSubmit() {
    if (!file) {
      toast.error("Pick an image first");
      return;
    }
    const fd = new FormData();
    fd.append("images", file);
    const res = await addImage(fd);
    if (res?.error) {
      toast.error(res.error?.data?.message || "Upload failed");
      return;
    }
    toast.success("Banner added");
    reset();
    onClose?.();
  }

  return (
    <RModal
      open={open}
      onClose={() => {
        reset();
        onClose?.();
      }}
      center
      classNames={{ modal: "rounded-2xl !p-0 !m-0", overlay: "bg-black/40" }}
    >
      <div className="w-[520px] max-w-[92vw] p-6">
        <h3 className="text-lg font-semibold text-ink-900">Upload banner</h3>
        <p className="text-sm text-ink-500 mt-1 mb-4">
          16:7 ratio works best on the homepage slider.
        </p>

        <label
          htmlFor="slider-file"
          className="block aspect-[16/7] rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 overflow-hidden cursor-pointer hover:border-primary hover:bg-primary-50/40 transition relative"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-ink-500">
              <TbCameraPlus className="w-8 h-8 mb-2 text-primary" />
              <span className="text-sm font-medium">Click to choose an image</span>
              <span className="text-xs text-ink-400 mt-1">PNG / JPG up to 5MB</span>
            </div>
          )}
        </label>
        <input
          id="slider-file"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={pick}
        />

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="secondary" onClick={() => { reset(); onClose?.(); }}>
            Cancel
          </Button>
          <Button iconLeft={TbUpload} onClick={handleSubmit} loading={isLoading}>
            Upload banner
          </Button>
        </div>
      </div>
    </RModal>
  );
}
