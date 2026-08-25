import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { appStatus, postStatus } from "@/lib/status";
import type { AppRow, AppEventRow, PostRow } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRelative(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export default async function AdminDashboardPage() {
  let apps: AppRow[] = [];
  let posts: PostRow[] = [];
  let views = 0;
  let downloads = 0;
  let recentEvents: AppEventRow[] = [];

  try {
    const supabase = await createClient();
    const [appsRes, postsRes, viewsRes, downloadsRes, eventsRes] =
      await Promise.all([
        supabase.from("apps").select("*").order("updated_at", { ascending: false }),
        supabase.from("posts").select("*").order("updated_at", { ascending: false }),
        supabase
          .from("app_events")
          .select("id", { count: "exact", head: true })
          .eq("event", "view"),
        supabase
          .from("app_events")
          .select("id", { count: "exact", head: true })
          .eq("event", "download"),
        supabase
          .from("app_events")
          .select("id, app_id, user_id, event, platform, created_at, apps(title, slug)")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

    if (appsRes.error) console.error("Dashboard apps fetch failed:", appsRes.error.message);
    if (postsRes.error) console.error("Dashboard posts fetch failed:", postsRes.error.message);
    if (eventsRes.error) console.error("Dashboard events fetch failed:", eventsRes.error.message);

    apps = (appsRes.data ?? []) as AppRow[];
    posts = (postsRes.data ?? []) as PostRow[];
    views = viewsRes.count ?? 0;
    downloads = downloadsRes.count ?? 0;
    recentEvents = (eventsRes.data ?? []) as unknown as AppEventRow[];
  } catch (err) {
    console.error("Dashboard fetch threw:", err);
  }

  const publishedApps = apps.filter((a) => a.is_published).length;
  const draftApps = apps.length - publishedApps;
  const featuredApps = apps.filter((a) => a.is_featured).length;

  const publishedPosts = posts.filter((p) => p.is_published).length;
  const unpublishedPosts = posts.filter((p) => !p.is_published && p.published_at).length;
  const draftPosts = posts.length - publishedPosts - unpublishedPosts;

  const recentApps = apps.slice(0, 5);
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Overview
      </p>
      <h1 className="display mt-1 text-3xl text-text">DASHBOARD</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/apps" className="nb-btn">
          Apps
        </Link>
        <Link href="/admin/posts" className="nb-btn">
          Posts
        </Link>
        <Link href="/admin/apps/new" className="nb-btn nb-btn--secondary">
          + New app
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Apps stats */}
        <div className="nb-card">
          <p className="display text-sm text-text">APPS</p>
          <p className="mt-3 display text-4xl text-text">{apps.length}</p>
          <dl className="mt-4 space-y-1.5 font-mono text-[0.68rem] text-muted">
            <div className="flex justify-between gap-3">
              <dt className="uppercase tracking-wider">Published</dt>
              <dd className="text-text">{publishedApps}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="uppercase tracking-wider">Drafts</dt>
              <dd className="text-text">{draftApps}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="uppercase tracking-wider">Featured</dt>
              <dd className="text-text">{featuredApps}</dd>
            </div>
          </dl>
        </div>

        {/* Posts stats */}
        <div className="nb-card">
          <p className="display text-sm text-text">POSTS</p>
          <p className="mt-3 display text-4xl text-text">{posts.length}</p>
          <dl className="mt-4 space-y-1.5 font-mono text-[0.68rem] text-muted">
            <div className="flex justify-between gap-3">
              <dt className="uppercase tracking-wider">Published</dt>
              <dd className="text-text">{publishedPosts}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="uppercase tracking-wider">Drafts</dt>
              <dd className="text-text">{draftPosts}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="uppercase tracking-wider">Unpublished</dt>
              <dd className="text-text">{unpublishedPosts}</dd>
            </div>
          </dl>
        </div>

        {/* Analytics stats */}
        <div className="nb-card">
          <p className="display text-sm text-text">ANALYTICS</p>
          <p className="mt-3 font-mono text-xs text-muted">all time</p>
          <dl className="mt-3 space-y-1.5 font-mono text-[0.68rem] text-muted">
            <div className="flex justify-between gap-3">
              <dt className="uppercase tracking-wider">Views</dt>
              <dd className="text-text">{views}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="uppercase tracking-wider">Downloads</dt>
              <dd className="text-text">{downloads}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {/* Recent apps */}
        <section>
          <h2 className="mb-3 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-muted">
            Recent apps
          </h2>
          <ul className="space-y-3">
            {recentApps.length === 0 && (
              <li className="nb-card font-mono text-xs text-muted">None yet.</li>
            )}
            {recentApps.map((app) => {
              const status = appStatus(app);
              return (
                <li key={app.id}>
                  <Link
                    href={`/admin/apps/${app.id}`}
                    className="nb-card nb-card--link block no-underline"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="display min-w-0 flex-1 text-sm text-text">
                        {app.title}
                      </p>
                      <span className={`nb-status ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-[0.65rem] text-muted">
                      {formatDate(app.updated_at)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Recent posts */}
        <section>
          <h2 className="mb-3 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-muted">
            Recent posts
          </h2>
          <ul className="space-y-3">
            {recentPosts.length === 0 && (
              <li className="nb-card font-mono text-xs text-muted">None yet.</li>
            )}
            {recentPosts.map((post) => {
              const status = postStatus(post);
              return (
                <li key={post.id}>
                  <Link
                    href="/admin/posts"
                    className="nb-card nb-card--link block no-underline"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="display min-w-0 flex-1 text-sm text-text">
                        {post.title}
                      </p>
                      <span className={`nb-status ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-[0.65rem] text-muted">
                      {formatDate(post.updated_at)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Recent events */}
        <section>
          <h2 className="mb-3 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-muted">
            Recent events
          </h2>
          <ul className="space-y-3">
            {recentEvents.length === 0 && (
              <li className="nb-card font-mono text-xs text-muted">No activity yet.</li>
            )}
            {recentEvents.map((event) => (
              <li key={event.id} className="nb-card">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 truncate font-mono text-xs text-text">
                    {event.apps?.title ?? "Unknown app"}
                  </p>
                  <span
                    className="nb-status"
                    style={{
                      background: "var(--primary)",
                      color: "var(--ink)",
                    }}
                  >
                    {event.event === "view" ? "New Visitor" : "New Download"}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[0.65rem] text-muted">
                  {event.platform ?? "web"} · {formatRelative(event.created_at)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}