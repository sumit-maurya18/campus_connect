/**
 * Work Service
 *
 * Handles business logic for internships and jobs.
 * Controllers should never directly call models.
 */

const workModel = require("../models/workOpportunityModel");

class WorkService {

  async createInternship(data) {
    return workModel.create(data, "internship");
  }

  async createJob(data) {
    return workModel.create(data, "job");
  }

  async getInternships(filters, page, limit) {
    return workModel.findAll(
      { ...filters, work_type: "internship" },
      page,
      limit
    );
  }

  async getJobs(filters, page, limit) {
    return workModel.findAll(
      { ...filters, work_type: "job" },
      page,
      limit
    );
  }

  async getFeaturedInternships(limit) {
    return workModel.getFeatured("internship", limit);
  }

  async getFeaturedJobs(limit) {
    return workModel.getFeatured("job", limit);
  }

  async findByOrganization(name, limit) {
    return workModel.findByOrganization(name, limit);
  }

  async getExpiringSoon(days, limit) {
    return workModel.findExpiringSoon(days, limit);
  }

}

module.exports = new WorkService();