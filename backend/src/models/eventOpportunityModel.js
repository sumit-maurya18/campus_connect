const BaseOpportunityModel=require("./baseOpportunityModel");
const { query }=require("../config/database");

class EventOpportunityModel extends BaseOpportunityModel{

  constructor(){
    super("opportunities_event","event_type");
  }

  async create(data,eventType){

    const sql=`
      INSERT INTO opportunities_event
      (
        event_type,title,apply_url,city,country,
        organization,image_url,team_size,fees,
        perks,event_date,learning_type,
        deadline,tags,domain,source,
        external_id,is_verified,is_featured
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,
        $10,$11,$12,$13,$14,$15,$16,
        $17,$18,$19
      )
      ON CONFLICT(event_type,apply_url)
      DO UPDATE SET
        last_seen_date=NOW(),
        updated_at=NOW()
      RETURNING *,
        CASE WHEN xmax=0 THEN 'created'
        ELSE 'updated'
        END as action
    `;

    const values=[
      eventType,
      data.title,
      data.apply_url,
      data.city||null,
      data.country||null,
      data.organization||null,
      data.image_url||null,
      data.team_size||null,
      data.fees||null,
      data.perks||null,
      data.event_date||null,
      data.learning_type||null,
      data.deadline||null,
      data.tags||null,
      data.domain||null,
      data.source||"manual",
      data.external_id||null,
      data.is_verified||false,
      data.is_featured||false
    ];

    const result=await query(sql,values);

    return result.rows[0];
  }

  async getFeatured(eventType,limit=4){

    const sql=`
      SELECT *
      FROM ${this.tableName}
      WHERE event_type=$1
      AND status='active'
      AND is_featured=true
      ORDER BY posted_date DESC
      LIMIT $2
    `;

    const result=await query(sql,[eventType,limit]);

    return result.rows;
  }

  async findUpcoming(days=30,limit=20){

    const sql=`
      SELECT *
      FROM ${this.tableName}
      WHERE status='active'
      AND event_date BETWEEN NOW()
      AND NOW()+INTERVAL '${days} days'
      ORDER BY event_date ASC
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
          const result=await this.create(opp,opp.event_type);
          return{
            id:result.id,
            type:result.event_type,
            table:"opportunities_event",
            status:result.action,
            url:result.apply_url
          };
        }catch(err){
          return{
            url:opp.apply_url,
            type:opp.event_type,
            status:"failed",
            error:err.message
          };
        }
      })
    );

    return results;
  }

}

module.exports=new EventOpportunityModel();