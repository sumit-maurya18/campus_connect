const BaseOpportunityModel = require("./baseOpportunityModel");
const { query } = require("../config/database");

class WorkOpportunityModel extends BaseOpportunityModel {

  constructor() {
    super("opportunities_work", "work_type");
  }

  async create(data, workType) {

    const sql=`
      INSERT INTO opportunities_work
      (
        work_type,title,apply_url,city,country,
        work_style,organization,company,image_url,
        stipend,duration,salary,experience,
        skills,who_can_apply,deadline,tags,
        source,external_id,is_verified,is_featured
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,$16,
        $17,$18,$19,$20,$21
      )
      ON CONFLICT(work_type,apply_url)
      DO UPDATE SET
        last_seen_date=NOW(),
        updated_at=NOW()
      RETURNING *,
        CASE WHEN xmax=0 THEN 'created'
        ELSE 'updated'
        END as action
    `;

    const values=[
      workType,
      data.title,
      data.apply_url,
      data.city||null,
      data.country||null,
      data.work_style||null,
      data.organization||null,
      data.company||null,
      data.image_url||null,
      data.stipend||null,
      data.duration||null,
      data.salary||null,
      data.experience||null,
      data.skills||null,
      data.who_can_apply||null,
      data.deadline||null,
      data.tags||null,
      data.source||"manual",
      data.external_id||null,
      data.is_verified||false,
      data.is_featured||false
    ];

    const result=await query(sql,values);

    return result.rows[0];
  }

  async getFeatured(workType,limit=4){

    const sql=`
      SELECT *
      FROM ${this.tableName}
      WHERE work_type=$1
      AND status='active'
      AND is_featured=true
      ORDER BY posted_date DESC
      LIMIT $2
    `;

    const result=await query(sql,[workType,limit]);

    return result.rows;
  }

  async findExpiringSoon(days=7,limit=20){

    const sql=`
      SELECT *
      FROM ${this.tableName}
      WHERE status='active'
      AND deadline BETWEEN NOW()
      AND NOW()+INTERVAL '${days} days'
      ORDER BY deadline ASC
      LIMIT $1
    `;

    const result=await query(sql,[limit]);

    return result.rows;
  }

  async findAll(filters={},page=1,limit=10){

    const offset=(page-1)*limit;

    const {whereClause,values,paramIndex}=this.buildWhereClause(filters);

    const orderClause=this.buildOrderClause(filters.sort,filters.order);

    const countSql=`SELECT COUNT(*) FROM ${this.tableName} ${whereClause}`;

    const countResult=await query(countSql,values);

    const total=parseInt(countResult.rows[0].count);

    values.push(limit,offset);

    const sql=`
      SELECT *
      FROM ${this.tableName}
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex}
      OFFSET $${paramIndex+1}
    `;

    const result=await query(sql,values);

    return{
      data:result.rows,
      pagination:{
        total,
        page,
        limit,
        totalPages:Math.ceil(total/limit),
        hasMore:page*limit<total
      }
    };
  }

  async bulkUpsert(opportunities){

    const results=await Promise.all(
      opportunities.map(async opp=>{
        try{
          const result=await this.create(opp,opp.work_type);
          return{
            id:result.id,
            type:result.work_type,
            table:"opportunities_work",
            status:result.action,
            url:result.apply_url
          };
        }catch(err){
          return{
            url:opp.apply_url,
            type:opp.work_type,
            status:"failed",
            error:err.message
          };
        }
      })
    );

    return results;
  }

}

module.exports=new WorkOpportunityModel();