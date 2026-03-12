/**
 * Event Service
 *
 * Handles business logic for:
 * hackathons
 * learning programs
 * scholarships
 */

const eventModel = require("../models/eventOpportunityModel");

class EventService {

  /**
   * CREATE OPERATIONS
   */

  async createHackathon(data) {
    return eventModel.create(data, "hackathon");
  }

  async createScholarship(data) {
    return eventModel.create(data, "scholarship");
  }

  async createLearning(data) {
    return eventModel.create(data, "learning");
  }


  /**
   * LIST OPERATIONS
   */

  async getHackathons(filters, page, limit) {

    return eventModel.findAll(
      { ...filters, type: "hackathon" },
      page,
      limit
    );
  }

  async getScholarships(filters, page, limit) {

    return eventModel.findAll(
      { ...filters, type: "scholarship" },
      page,
      limit
    );
  }

  async getLearning(filters, page, limit) {

    return eventModel.findAll(
      { ...filters, type: "learning" },
      page,
      limit
    );
  }


  /**
   * FEATURED SECTIONS
   * Used by homepage cards
   */

  async getFeaturedHackathons(limit = 4) {

    return eventModel.getFeatured(
      "hackathon",
      limit
    );
  }

  async getFeaturedLearning(limit = 4) {

    return eventModel.getFeatured(
      "learning",
      limit
    );
  }


  /**
   * UPCOMING EVENTS
   * Used for event countdown / discovery
   */

  async getUpcoming(days = 30, limit = 10) {

    return eventModel.findUpcoming(
      days,
      limit
    );
  }


  /**
   * FREE EVENTS FILTER
   */

  async getFreeEvents(type = null, limit = 20) {

    return eventModel.findFreeEvents(
      type,
      limit
    );
  }

}

module.exports = new EventService();