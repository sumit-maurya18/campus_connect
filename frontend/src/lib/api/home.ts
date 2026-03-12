import {
  getFeaturedInternships,
  getFeaturedJobs,
  getFeaturedHackathons,
  getUpcomingEvents
} from "./opportunities";

export async function getHomeData() {

  const [
    internships,
    jobs,
    hackathons,
    events
  ] = await Promise.all([

    getFeaturedInternships(3),
    getFeaturedJobs(3),
    getFeaturedHackathons(3),
    getUpcomingEvents({ days: 30, limit: 4 })

  ]);

  return {
    internships,
    jobs,
    hackathons,
    events
  };
}