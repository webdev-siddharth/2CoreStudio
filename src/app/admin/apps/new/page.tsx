"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { MarkdownBody } from "@/components/news/MarkdownBody";
import { createApp, checkSlugUnique } from "@/app/admin/apps/actions";
import { generateSlug } from "@/lib/slug";

const CATEGORIES = ["Gaming", "Utility", "SaaS"];
const TIERS = ["instant", "account", "premium"];

export default function NewAppPage() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [bodyContent, setBodyContent] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const slugRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const run = async (fd: FormData) => {
    try {
      setError(null);
      setSubmitting(true);

      const slug = (fd.get("slug") as string)?.trim();
      const title = (fd.get("title") as string)?.trim();

      if (!title) {
        const msg = "Title is required.";
        setError(msg);
        toast.error(msg);
        setSubmitting(false);
        return;
      }
      if (!slug) {
        const msg = "Slug is required.";
        setError(msg);
        toast.error(msg);
        setSubmitting(false);
        return;
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        const msg = "Slug must be lowercase alphanumeric with hyphens only.";
        setError(msg);
        toast.error(msg);
        setSubmitting(false);
        return;
      }

      const unique = await checkSlugUnique(slug);
      if (!unique) {
        const msg = "A post/app with this slug already exists.";
        setError(msg);
        toast.error(msg);
        setSubmitting(false);
        return;
      }

      await createApp(fd);
      toast.success("App created");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Action failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slugManuallyEdited && slugRef.current) {
      slugRef.current.value = generateSlug(e.target.value);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        href="/admin/apps"
        className="py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text no-underline hover:text-primary md:py-0"
      >
        ← Back to apps
      </Link>
      <h1 className="display mt-3 text-2xl text-text">NEW APP</h1>

      {error && (
        <p className="mt-3 border-2 border-ink bg-surface2 px-3 py-2 font-mono text-xs text-red">
          {error}
        </p>
      )}

      <form action={run} className="nb-card mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Title *</span>
          <input
            ref={titleRef}
            name="title"
            defaultValue=""
            onChange={handleTitleChange}
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">Slug *</span>
          <input
            ref={slugRef}
            name="slug"
            defaultValue=""
            onChange={() => setSlugManuallyEdited(true)}
            className="nb-input w-full"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="field-label">Description</span>
          <textarea
            name="description"
            className="nb-input w-full"
            rows={2}
          />
        </label>

        <div className="block sm:col-span-2">
          <span className="field-label">Detailed body (Markdown supported)</span>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`nb-chip ${activeTab === "write" ? "nb-chip--on" : ""}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`nb-chip ${activeTab === "preview" ? "nb-chip--on" : ""}`}
            >
              Preview
            </button>
          </div>
          {activeTab === "write" ? (
            <textarea
              name="detailed_body"
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              className="nb-input mt-2 w-full"
              rows={6}
            />
          ) : (
            <div className="nb-input mt-2 min-h-[156px] overflow-auto p-4">
              {bodyContent ? (
                <MarkdownBody content={bodyContent} />
              ) : (
                <p className="font-mono text-xs text-muted">Nothing to preview.</p>
              )}
            </div>
          )}
        </div>

        <label className="block">
          <span className="field-label">Category</span>
          <select name="category" defaultValue="Gaming" className="nb-input w-full">
            {CATEGORIES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="field-label">Access tier</span>
          <select name="access_tier" defaultValue="instant" className="nb-input w-full">
            {TIERS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="field-label">Thumbnail URL</span>
          <input
            name="thumbnail_url"
            defaultValue=""
            onChange={(e) => setThumbnailPreview(e.target.value)}
            className="nb-input w-full"
          />
          {thumbnailPreview && (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of a user-typed URL; any host is allowed
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="mt-2 max-h-32 border-[3px] border-ink object-cover"
              onError={() => setThumbnailPreview("")}
            />
          )}
        </label>
        <label className="block">
          <span className="field-label">Banner URL</span>
          <input
            name="banner_url"
            defaultValue=""
            onChange={(e) => setBannerPreview(e.target.value)}
            className="nb-input w-full"
          />
          {bannerPreview && (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of a user-typed URL; any host is allowed
            <img
              src={bannerPreview}
              alt="Banner preview"
              className="mt-2 w-full border-[3px] border-ink object-cover"
              onError={() => setBannerPreview("")}
            />
          )}
        </label>

        <label className="block">
          <span className="field-label">YouTube embed id</span>
          <input name="youtube_embed_id" defaultValue="" className="nb-input w-full" />
        </label>
        <label className="block">
          <span className="field-label">Product SKU</span>
          <input name="product_sku" defaultValue="" className="nb-input w-full" />
        </label>

        <label className="block">
          <span className="field-label">Featured order</span>
          <input
            type="number"
            name="featured_order"
            defaultValue={0}
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">GitHub URL (optional, for older releases)</span>
          <input
            name="github_url"
            defaultValue=""
            placeholder="https://github.com/..."
            className="nb-input w-full"
          />
        </label>

        <div className="flex flex-wrap gap-4 sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text">
            <input type="checkbox" name="is_published" className="h-4 w-4 accent-[var(--primary)]" />
            Published
          </label>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text">
            <input type="checkbox" name="requires_auth" className="h-4 w-4 accent-[var(--primary)]" />
            Requires account
          </label>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text">
            <input type="checkbox" name="is_featured" className="h-4 w-4 accent-[var(--primary)]" />
            Featured (hero)
          </label>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text">
            <input type="checkbox" name="is_premium" className="h-4 w-4 accent-[var(--primary)]" />
            Premium
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="nb-btn sm:col-span-2 disabled:opacity-50"
        >
          {submitting ? "CREATING…" : "Create app"}
        </button>
      </form>
    </div>
  );
}
