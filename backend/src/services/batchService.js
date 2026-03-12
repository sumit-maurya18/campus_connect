/**
 * Batch Service
 *
 * Handles bulk insertion of scraped opportunities.
 */

const workModel = require("../models/workOpportunityModel");
const eventModel = require("../models/eventOpportunityModel");

class BatchService {

  async batchCreate(source, opportunities) {

    const workOpps = [];
    const eventOpps = [];

    for (const opp of opportunities) {

      opp.source = source || "batch";

      if (!opp.type) {
        continue;
      }

      if (["internship", "job"].includes(opp.type)) {

        workOpps.push({
          ...opp,
          work_type: opp.type
        });

      } else if (
        ["hackathon", "learning", "scholarship"].includes(opp.type)
      ) {

        eventOpps.push({
          ...opp,
          event_type: opp.type
        });

      }
    }

    const [workResults, eventResults] = await Promise.all([
      workOpps.length ? workModel.bulkUpsert(workOpps) : [],
      eventOpps.length ? eventModel.bulkUpsert(eventOpps) : []
    ]);

    const allResults = [...workResults, ...eventResults];

    const summary = {
      total: opportunities.length,
      created: allResults.filter(r => r.status === "created").length,
      updated: allResults.filter(r => r.status === "updated").length,
      failed: allResults.filter(r => r.status === "failed").length
    };

    return {
      summary,
      results: allResults
    };
  }

}

module.exports = new BatchService();