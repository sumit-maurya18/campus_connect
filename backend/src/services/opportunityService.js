/**
 * Opportunity Service
 *
 * Cross-table operations across:
 * opportunities_work
 * opportunities_event
 */

const workModel = require("../models/workOpportunityModel");
const eventModel = require("../models/eventOpportunityModel");

class OpportunityService {

  async getById(id) {

    let opportunity = await workModel.findById(id);
    let category = "work";
    let model = workModel;

    if (!opportunity) {
      opportunity = await eventModel.findById(id);
      category = "event";
      model = eventModel;
    }

    if (!opportunity) {
      return null;
    }

    await model.incrementViewCount(id);

    opportunity.view_count = (opportunity.view_count || 0) + 1;

    return {
      ...opportunity,
      category
    };
  }

  async update(id, updates) {

    let opportunity = await workModel.findById(id);
    let model = workModel;

    if (!opportunity) {
      opportunity = await eventModel.findById(id);
      model = eventModel;
    }

    if (!opportunity) {
      return null;
    }

    return model.update(id, updates);
  }

  async delete(id) {

    let opportunity = await workModel.findById(id);

    if (opportunity) {
      await workModel.delete(id, true);
      return "deleted";
    }

    opportunity = await eventModel.findById(id);

    if (opportunity) {
      await eventModel.delete(id, false);
      return "archived";
    }

    return null;
  }

  async getStats() {

    const [workStats, eventStats] = await Promise.all([
      workModel.getStats(),
      eventModel.getStats()
    ]);

    return {
      work: workStats,
      event: eventStats
    };
  }

}

module.exports = new OpportunityService();