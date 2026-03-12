// src/lib/api/opportunities.ts
// ─────────────────────────────────────────────────────────
// Types match your DB schema exactly (campus_connect).
// Field names are the raw column names from your tables.
//
// opportunities_work  → Internship | Job
// opportunities_event → Hackathon | LearningProgram | Scholarship
// ─────────────────────────────────────────────────────────

import { apiGet, apiFetch, type ApiResponse } from "./client";

// ── opportunities_work columns ────────────────────────────
export interface WorkOpportunity {
  id:             string;          // UUID
  work_type:      "internship" | "job";
  title:          string;
  apply_url:      string;
  city?:          string | null;
  country?:       string | null;
  work_style?:    "remote" | "hybrid" | "onsite" | null;
  organization?:  string | null;
  company?:       string | null;   // fallback to organization
  image_url?:     string | null;
  // Internship-specific
  stipend?:       string | null;   // stored as VARCHAR e.g. "15000-20000"
  duration?:      string | null;
  // Job-specific
  salary?:        string | null;
  experience?:    string | null;
  skills?:        string[] | null;
  who_can_apply?: string | null;
  deadline?:      string | null;   // ISO timestamp
  tags?:          string[] | null;
  source?:        string | null;
  external_id?:   string | null;
  status:         "active" | "expired";
  is_verified:    boolean;
  is_featured:    boolean;
  view_count:     number;
  posted_date:    string;
  last_seen_date: string;
  created_at:     string;
  updated_at:     string;
}

// Typed aliases for clarity
export type Internship = WorkOpportunity & { work_type: "internship" };
export type Job        = WorkOpportunity & { work_type: "job" };

// ── opportunities_event columns ───────────────────────────
export interface EventOpportunity {
  id:            string;           // UUID
  event_type:    "hackathon" | "learning" | "scholarship";
  title:         string;
  apply_url:     string;
  city?:         string | null;
  country?:      string | null;
  organization?: string | null;
  image_url?:    string | null;
  team_size?:    string | null;    // e.g. "2-4"
  fees?:         "paid" | "unpaid" | null;
  perks?:        string | null;
  event_date?:   string | null;    // ISO timestamp
  learning_type?:"workshop" | "course" | "bootcamp" | "mentorship" | null;
  deadline?:     string | null;
  tags?:         string[] | null;
  domain?:       string[] | null;
  source?:       string | null;
  external_id?:  string | null;
  status:        "active" | "expired" | "archived";
  is_verified:   boolean;
  is_featured:   boolean;
  view_count:    number;
  posted_date:   string;
  last_seen_date:string;
  created_at:    string;
  updated_at:    string;
}

export type Hackathon       = EventOpportunity & { event_type: "hackathon" };
export type LearningProgram = EventOpportunity & { event_type: "learning" };
export type Scholarship     = EventOpportunity & { event_type: "scholarship" };

// ── Internships ───────────────────────────────────────────

/** 3 featured internships → GET /api/internships/featured */
export async function getFeaturedInternships(limit = 3): Promise<Internship[]> {
  return apiGet<Internship[]>(`/api/internships/featured?limit=${limit}`);
}

/** All internships with pagination → GET /api/internships */
export async function getInternships(params?: {
  page?:       number;
  limit?:      number;
  city?:       string;
  work_style?: "remote" | "hybrid" | "onsite";
  search?:     string;
}): Promise<ApiResponse<Internship[]>> {
  const qs = new URLSearchParams();
  if (params?.page)       qs.set("page",       String(params.page));
  if (params?.limit)      qs.set("limit",      String(params.limit));
  if (params?.city)       qs.set("city",       params.city);
  if (params?.work_style) qs.set("work_style", params.work_style);
  if (params?.search)     qs.set("search",     params.search);
  return apiFetch<Internship[]>(`/api/internships?${qs}`);
}

// ── Jobs ──────────────────────────────────────────────────

/** 3 featured jobs → GET /api/jobs/featured */
export async function getFeaturedJobs(limit = 3): Promise<Job[]> {
  return apiGet<Job[]>(`/api/jobs/featured?limit=${limit}`);
}

/** All jobs with pagination → GET /api/jobs */
export async function getJobs(params?: {
  page?:       number;
  limit?:      number;
  city?:       string;
  work_style?: "remote" | "hybrid" | "onsite";
  search?:     string;
}): Promise<ApiResponse<Job[]>> {
  const qs = new URLSearchParams();
  if (params?.page)       qs.set("page",       String(params.page));
  if (params?.limit)      qs.set("limit",      String(params.limit));
  if (params?.city)       qs.set("city",       params.city);
  if (params?.work_style) qs.set("work_style", params.work_style);
  if (params?.search)     qs.set("search",     params.search);
  return apiFetch<Job[]>(`/api/jobs?${qs}`);
}

// ── Hackathons ────────────────────────────────────────────

/** 3 featured hackathons → GET /api/hackathons/featured */
export async function getFeaturedHackathons(limit = 3): Promise<Hackathon[]> {
  return apiGet<Hackathon[]>(`/api/hackathons/featured?limit=${limit}`);
}

/** All hackathons → GET /api/hackathons */
export async function getHackathons(params?: {
  page?:  number;
  limit?: number;
  fees?:  "paid" | "unpaid";
  city?:  string;
}): Promise<ApiResponse<Hackathon[]>> {
  const qs = new URLSearchParams();
  if (params?.page)  qs.set("page",  String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.fees)  qs.set("fees",  params.fees);
  if (params?.city)  qs.set("city",  params.city);
  return apiFetch<Hackathon[]>(`/api/hackathons?${qs}`);
}

// ── Events (upcoming) ─────────────────────────────────────

/** Upcoming events → GET /api/events/upcoming */
export async function getUpcomingEvents(params?: {
  days?:  number;
  limit?: number;
}): Promise<EventOpportunity[]> {
  const qs = new URLSearchParams();
  qs.set("days",  String(params?.days  ?? 30));
  qs.set("limit", String(params?.limit ?? 3));
  return apiGet<EventOpportunity[]>(`/api/events/upcoming?${qs}`);
}

/** Free events → GET /api/events/free */
export async function getFreeEvents(type?: string): Promise<EventOpportunity[]> {
  const qs = type ? `?type=${type}` : "";
  return apiGet<EventOpportunity[]>(`/api/events/free${qs}`);
}

// ── Learning ──────────────────────────────────────────────

/** 3 featured learning programs → GET /api/learning/featured */
export async function getFeaturedLearning(limit = 3): Promise<LearningProgram[]> {
  return apiGet<LearningProgram[]>(`/api/learning/featured?limit=${limit}`);
}

// ── Single opportunity (cross-table) ─────────────────────

export async function getOpportunityById(id: string): Promise<WorkOpportunity | EventOpportunity> {
  return apiGet(`/api/opportunities/${id}`);
}