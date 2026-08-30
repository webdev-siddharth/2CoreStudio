-- Migration 002: Add category, tags, cover_alt, seo_title, seo_description to posts
-- Run in Supabase SQL Editor

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Update',
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS cover_alt text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text;
