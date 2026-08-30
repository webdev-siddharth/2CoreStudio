"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { createPost } from "@/app/admin/posts/actions";
import { generateSlug } from "@/lib/slug";

const CATEGORIES = [
  "Release",
  "Update",
  "Announcement",
  "Tutorial",
  "Changelog",
  "Other",
];

function field(
  name: string,
  placeholder: string | undefined = undefined,
  className = ""
) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      defaultValue=""
      className={`nb-input w-full ${className}`}
    />
  );
}

function ErrorNote({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p className="mt-3 border-2 border-ink bg-surface2 px-3 py-2 font-mono text-xs text-red">
      {error}
    </p>
  );
}

export default function NewPostPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [category, setCategory] = useState("Release");
  const [customCategory, setCustomCategory] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) {
      setSlug(generateSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugEdited(true);
    setSlug(value);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    if (value !== "Other") {
      setCustomCategory("");
    }
  }

  const displayCategory = category === "Other" ? customCategory : category;
  const tagsArray = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const run = async (fd: FormData) => {
    try {
      setError(null);
      setSubmitting(true);

      fd.set("category", displayCategory || "Update");
      fd.set("tags", JSON.stringify(tagsArray));

      await createPost(fd);
      toast.success("Post created");
      router.push("/admin/posts");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Action failed";
      setError(msg);
      toast.error(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        href="/admin/posts"
        className="py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text no-underline hover:text-primary md:py-0"
      >
        ← Back to posts
      </Link>
      <h1 className="display mt-3 text-2xl text-text">NEW POST</h1>

      <ErrorNote error={error} />

      <form action={run} className="nb-card mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Title *</span>
          <input
            name="title"
            placeholder="Post title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">Slug *</span>
          <input
            name="slug"
            placeholder="auto-generated-from-title"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">Category</span>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="nb-input w-full"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        {category === "Other" && (
          <label className="block">
            <span className="field-label">Custom category *</span>
            <input
              name="custom_category"
              placeholder="Enter category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="nb-input w-full"
            />
          </label>
        )}
        <label className="block sm:col-span-2">
          <span className="field-label">Tags (comma-separated)</span>
          <input
            name="tags"
            placeholder="e.g. expense-tracker, finance, new-feature"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="nb-input w-full"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Excerpt</span>
          <textarea
            name="excerpt"
            className="nb-input w-full"
            rows={2}
          />
        </label>
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="field-label">Body (Markdown)</span>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="nb-chip"
            >
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
          {preview ? (
            <div className="md-body mt-1 border-[3px] border-ink bg-surface p-3 font-mono text-sm leading-relaxed text-text">
              {body ? (
                <Markdown>{body}</Markdown>
              ) : (
                <p className="text-muted">Nothing to preview.</p>
              )}
            </div>
          ) : (
            <textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="nb-input mt-1 w-full"
              rows={10}
              placeholder="Write your post in Markdown..."
            />
          )}
        </div>
        <label className="block">
          <span className="field-label">Cover URL</span>
          <input
            name="cover_url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">Cover Alt Text</span>
          {field("cover_alt", "Description of cover image")}
        </label>
        {coverUrl && (
          <div className="sm:col-span-2">
            <span className="field-label">Cover preview</span>
            <div
              aria-hidden
              className="mt-1 aspect-video border-[3px] border-ink bg-cover bg-center"
              style={{ backgroundImage: `url(${coverUrl})` }}
            />
          </div>
        )}
        <label className="block">
          <span className="field-label">SEO Title</span>
          {field("seo_title", "Overrides <title> tag")}
        </label>
        <label className="block">
          <span className="field-label">SEO Description</span>
          {field("seo_description", "Overrides meta description")}
        </label>
        <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text sm:col-span-2">
          <input
            type="checkbox"
            name="is_published"
            className="h-4 w-4 accent-[var(--primary)]"
          />
          Published
        </label>
        <button
          type="submit"
          disabled={submitting}
          className={`nb-btn sm:col-span-2 ${submitting ? "nb-btn--disabled" : ""}`}
        >
          {submitting ? "Creating..." : "Create post"}
        </button>
      </form>
    </div>
  );
}
