"use client";

import Link from "next/link";
import { useState } from "react";
import { createApp } from "@/app/admin/apps/actions";

const CATEGORIES = ["Gaming", "Utility", "SaaS"];
const TIERS = ["instant", "account", "premium"];

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

function select(name: string, options: string[], className = "") {
  return (
    <select
      name={name}
      defaultValue={options[0]}
      className={`nb-input w-full ${className}`}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function check(name: string, label: string) {
  return (
    <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text">
      <input
        type="checkbox"
        name={name}
        className="h-4 w-4 accent-[var(--primary)]"
      />
      {label}
    </label>
  );
}

export default function NewAppPage() {
  const [error, setError] = useState<string | null>(null);

  const run = async (fd: FormData) => {
    try {
      setError(null);
      await createApp(fd);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
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
        <p className="mt-3 border-2 border-ink bg-surface2 px-3 py-2 font-mono text-xs text-secondary">
          {error}
        </p>
      )}

      <form action={run} className="nb-card mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Title *</span>
          {field("title")}
        </label>
        <label className="block">
          <span className="field-label">Slug *</span>
          {field("slug")}
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Description</span>
          <textarea
            name="description"
            className="nb-input w-full"
            rows={2}
          />
        </label>
        <label className="block">
          <span className="field-label">Category</span>
          {select("category", CATEGORIES)}
        </label>
        <label className="block">
          <span className="field-label">Access tier</span>
          {select("access_tier", TIERS)}
        </label>
        <label className="block">
          <span className="field-label">Thumbnail URL</span>
          {field("thumbnail_url")}
        </label>
        <label className="block">
          <span className="field-label">Banner URL</span>
          {field("banner_url")}
        </label>
        <div className="flex flex-wrap gap-4 sm:col-span-2">
          {check("is_published", "Published")}
          {check("requires_auth", "Requires account")}
        </div>
        <button type="submit" className="nb-btn sm:col-span-2">
          Create app
        </button>
      </form>
    </div>
  );
}