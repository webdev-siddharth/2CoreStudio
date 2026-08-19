import type { AppRow, PostRow } from "@/lib/types";

export interface StatusChip {
  label: string;
  className: string;
}

export function appStatus(
  app: Pick<AppRow, "is_published">
): StatusChip {
  return app.is_published
    ? { label: "Published", className: "nb-status--published" }
    : { label: "Draft", className: "nb-status--draft" };
}

export function postStatus(
  post: Pick<PostRow, "is_published" | "published_at">
): StatusChip {
  if (post.is_published)
    return { label: "Published", className: "nb-status--published" };
  if (post.published_at)
    return { label: "Unpublished", className: "nb-status--unpublished" };
  return { label: "Draft", className: "nb-status--draft" };
}