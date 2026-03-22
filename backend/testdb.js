require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("CONNECTED:", res.rows);
  } catch (err) {
    console.error("REAL ERROR:", err);
  }
})();