// Edit personal info — admin profile form.
//
// Profile photo upload + name + location fields. Email is shown but
// can't be edited (the backend treats it as the unique account key).

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TbArrowLeft, TbCameraPlus, TbDeviceFloppy } from "react-icons/tb";

import baseUrl from "../../baseUrl";
import getImageUrl from "../../utils/getImageUrl";
import {
  useUpdateProfielPictureMutation,
  useUpdateProfileInfoMutation,
} from "../../redux/api/apiSlice";

import PageHeader from "../../common/PageHeader";
import Card from "../../common/Card";
import Button from "../../common/Button";

export default function EditPersonalInfo() {
  const navigate = useNavigate();
  const cached = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })();

  const [user, setUser] = useState(cached);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState(cached?.fullName || "");
  const [location, setLocation] = useState(cached?.location || "");

  const [updateProfile, { isLoading: savingInfo }] = useUpdateProfileInfoMutation();
  const [updateImage, { isLoading: savingImage }] = useUpdateProfielPictureMutation();

  useEffect(() => {
    if (!cached?.id) return;
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/v1/users/${cached.id}`);
        const json = await res.json();
        if (json?.code === 200) {
          const u = json.data.attributes.user;
          setUser(u);
          setName(u?.fullName || "");
          setLocation(u?.location || "");
        }
      } catch {
        /* keep the cached defaults */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cached?.id]);

  function pickFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let imageUrl = user?.image;
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const res = await updateImage(fd).unwrap();
        // Backend may return the new image URL on either of these paths.
        imageUrl =
          res?.data?.attributes?.image ||
          res?.imageUrl ||
          res?.image ||
          imageUrl;
      }
      const res = await updateProfile({
        fullName: name,
        email: user?.email,
        location,
        image: imageUrl,
      }).unwrap();

      // Refresh the cached user so the topbar profile chip + everywhere
      // else picks up the new name / image without a hard reload.
      try {
        const refreshed = res?.data?.attributes?.user || res?.data?.attributes;
        if (refreshed) {
          localStorage.setItem("user", JSON.stringify(refreshed));
        }
      } catch {
        /* noop */
      }

      toast.success("Profile updated");
      navigate("/dashboard/personalinfo");
    } catch (err) {
      toast.error(err?.data?.message || "Couldn't save changes");
    }
  }

  const saving = savingInfo || savingImage;
  const displayedImage = previewUrl || getImageUrl(user?.image);

  return (
    <div>
      <PageHeader
        title="Edit profile"
        subtitle="Update the details that appear in the admin topbar."
        actions={
          <Link to="/dashboard/personalinfo">
            <Button variant="secondary" iconLeft={TbArrowLeft}>
              Cancel
            </Button>
          </Link>
        }
      />

      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center text-center bg-ink-50/60 rounded-2xl p-6">
            <label
              htmlFor="profile-image"
              className="relative w-32 h-32 rounded-full bg-white border-4 border-white shadow ring-1 ring-ink-100 overflow-hidden cursor-pointer group"
            >
              {displayedImage ? (
                <img
                  src={displayedImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary-700 bg-primary-50">
                  {user?.fullName?.[0]?.toUpperCase() || "A"}
                </div>
              )}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <TbCameraPlus className="w-6 h-6 text-white" />
              </div>
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={pickFile}
            />
            <p className="text-xs text-ink-500 mt-3">
              Click the photo to change it.
              <br />
              JPG / PNG up to 4MB.
            </p>
          </div>

          <div className="md:col-span-2 space-y-4">
            <Field label="Full name">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-ink-200 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
              />
            </Field>
            <Field label="Email" hint="Email can't be changed — it's the unique account key.">
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2.5 text-sm border border-ink-200 rounded-lg bg-ink-50 text-ink-500 outline-none"
              />
            </Field>
            <Field label="Location">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, country"
                className="w-full px-3 py-2.5 text-sm border border-ink-200 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
              />
            </Field>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Link to="/dashboard/personalinfo">
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" loading={saving} iconLeft={TbDeviceFloppy}>
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-400 mt-1">{hint}</p> : null}
    </div>
  );
}
