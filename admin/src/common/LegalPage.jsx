// Shared "view a legal page" component. Renders the page title + the
// saved HTML content + an Edit button that routes to the matching edit
// route. Used by Privacy / Terms / Trust & safety so each of those is
// just a 10-line wrapper.

import { Link } from "react-router-dom";
import { IoArrowBack, IoCreateOutline } from "react-icons/io5";

import PageHeader from "./PageHeader";
import Card from "./Card";
import Button from "./Button";

export default function LegalPage({ title, subtitle, content, editPath, loading }) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <Link to="/dashboard/setting">
              <Button variant="secondary" iconLeft={IoArrowBack}>
                Back to settings
              </Button>
            </Link>
            <Link to={editPath}>
              <Button iconLeft={IoCreateOutline}>Edit content</Button>
            </Link>
          </>
        }
      />
      <Card>
        {loading ? (
          <div className="py-10 text-center text-sm text-ink-500">Loading…</div>
        ) : !content ? (
          <div className="py-10 text-center text-sm text-ink-500">
            Nothing published yet. Click <b>Edit content</b> to add the first version.
          </div>
        ) : (
          <article
            className="prose prose-sm md:prose-base max-w-none text-ink-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </Card>
    </div>
  );
}
