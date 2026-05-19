// Shared rich-text editor for legal pages (Privacy / Terms / Trust &
// safety). Wraps jodit-react with our card/header chrome and a single
// "Save" button. Takes a title, a load query result, and a save
// mutation — keeps each page a thin shell.

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";

import PageHeader from "./PageHeader";
import Card from "./Card";
import Button from "./Button";

export default function LegalEditor({
  title,
  subtitle,
  initialContent,
  loading,
  onSave,
  backPath,
}) {
  const editor = useRef(null);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialContent != null) setContent(initialContent || "");
  }, [initialContent]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await onSave({ content });
      if (res?.error) {
        toast.error(res.error?.data?.message || "Couldn't save changes");
      } else {
        toast.success("Saved");
        navigate(backPath);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Link to={backPath}>
            <Button variant="secondary" iconLeft={IoArrowBack}>
              Cancel
            </Button>
          </Link>
        }
      />
      <Card>
        {loading ? (
          <div className="py-10 text-center text-sm text-ink-500">Loading…</div>
        ) : (
          <div className="bg-white">
            <JoditEditor
              ref={editor}
              value={content}
              onChange={(next) => setContent(next)}
              config={{ readonly: false, height: 480 }}
            />
          </div>
        )}
      </Card>
      <div className="mt-4 flex justify-end gap-2">
        <Link to={backPath}>
          <Button variant="secondary">Cancel</Button>
        </Link>
        <Button onClick={handleSave} loading={saving}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
