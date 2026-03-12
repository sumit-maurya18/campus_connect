import {
  Internship,
  Job,
  Hackathon,
  EventOpportunity
} from "@/lib/api/opportunities";

export function internshipCompany(item: Internship) {
  return item.company || item.organization || "Unknown";
}

export function jobCompany(item: Job) {
  return item.company || item.organization || "Unknown";
}

export function hackathonTag(deadline?: string | null) {

  if (!deadline) return "Open";

  const daysLeft =
    Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);

  if (daysLeft <= 0) return "Closed";
  if (daysLeft <= 3) return "Closing Soon";
  if (daysLeft <= 10) return "Registering";

  return "Open";
}

export function feesToTag(fees?: string | null) {

  if (fees === "unpaid") return "Free";
  if (fees === "paid") return "Paid";

  return "Free";
}