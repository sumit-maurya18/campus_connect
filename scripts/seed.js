// scripts/seed.js
// Purpose: Populate database with sample data for testing
// Run: npm run seed (from backend folder)

require('dotenv').config();
const { Pool } = require('pg');

// Checking is database password is redneredclear


/**
 * Create database connection
 * Note: We're in scripts/ folder, not backend/src/
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'campus_connect',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

/**
 * Sample data for seeding
 * These are realistic examples to test with
 */

// ============================================
// INTERNSHIPS (3 samples)
// ============================================
const sampleInternships = [
  {
    title: 'Software Engineering Intern',
    apply_url: 'https://careers.google.com/jobs/results/12345/',
    city: 'Bangalore',
    country: 'India',
    work_style: 'hybrid',
    organization: 'Google',
    stipend: '₹50,000/month',
    duration: '6 months',
    skills: ['Python', 'JavaScript', 'React'],
    tags: ['software', 'engineering', 'paid', 'tech'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    is_featured: true,
    is_verified: true
  },
  {
    title: 'Data Science Intern',
    apply_url: 'https://careers.microsoft.com/us/en/job/1234567/',
    city: 'Hyderabad',
    country: 'India',
    work_style: 'remote',
    organization: 'Microsoft',
    stipend: '₹45,000/month',
    duration: '3 months',
    skills: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
    tags: ['data-science', 'ml', 'remote', 'analytics'],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    is_verified: true
  },
  {
    title: 'Frontend Developer Intern',
    apply_url: 'https://www.amazon.jobs/en/jobs/2345678/',
    city: 'Mumbai',
    country: 'India',
    work_style: 'onsite',
    organization: 'Amazon',
    stipend: '₹40,000/month',
    duration: '6 months',
    skills: ['React', 'TypeScript', 'CSS', 'HTML'],
    tags: ['frontend', 'react', 'ui', 'web'],
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// ============================================
// JOBS (2 samples)
// ============================================
const sampleJobs = [
  {
    title: 'Junior Software Engineer',
    apply_url: 'https://careers.flipkart.com/opportunities/junior-sde',
    city: 'Bangalore',
    country: 'India',
    work_style: 'hybrid',
    organization: 'Flipkart',
    salary: '₹8-12 LPA',
    experience: '0-1 years',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
    tags: ['backend', 'java', 'entry-level', 'freshers'],
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    is_verified: true,
    is_featured: true
  },
  {
    title: 'Frontend Developer',
    apply_url: 'https://careers.swiggy.com/job/frontend-developer-123',
    city: 'Bangalore',
    country: 'India',
    work_style: 'remote',
    organization: 'Swiggy',
    salary: '₹6-10 LPA',
    experience: 'Freshers',
    skills: ['React', 'JavaScript', 'Redux', 'CSS'],
    tags: ['frontend', 'react', 'remote', 'freshers'],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// ============================================
// HACKATHONS (2 samples)
// ============================================
const sampleHackathons = [
  {
    title: 'AI Hackathon 2026',
    apply_url: 'https://ai-hackathon-2026.devpost.com/',
    city: 'Online',
    country: 'India',
    organization: 'Devpost',
    team_size: '2-4',
    fees: 'unpaid',
    perks: '₹50,000 Prize Pool + Certificates + Mentorship',
    event_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['ai', 'ml', 'hackathon', 'online', 'free'],
    domain: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning'],
    is_featured: true,
    is_verified: true
  },
  {
    title: 'Web3 Hackathon',
    apply_url: 'https://www.hackerearth.com/challenges/hackathon/web3-hack/',
    city: 'Delhi',
    country: 'India',
    organization: 'HackerEarth',
    team_size: '1-3',
    fees: 'unpaid',
    perks: '₹1,00,000 Prize + Internship Opportunities',
    event_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['web3', 'blockchain', 'crypto', 'hackathon'],
    domain: ['Blockchain', 'Web3', 'Cryptocurrency']
  }
];

// ============================================
// SCHOLARSHIPS (1 sample)
// ============================================
const sampleScholarships = [
  {
    title: 'Merit-cum-Means Scholarship 2026',
    apply_url: 'https://scholarships.gov.in/public/schemeGuidelines/MCM.pdf',
    city: 'All India',
    country: 'India',
    organization: 'Ministry of Education',
    fees: 'unpaid',
    perks: '₹50,000 per year for 4 years + Book Grant',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['scholarship', 'government', 'undergraduate', 'merit'],
    domain: ['Education', 'Financial Aid'],
    is_verified: true
  }
];

// ============================================
// LEARNING PROGRAMS (1 sample)
// ============================================
const sampleLearning = [
  {
    title: 'Full Stack Web Development Bootcamp',
    apply_url: 'https://www.coursera.org/specializations/full-stack-react',
    city: 'Online',
    country: 'Global',
    organization: 'Coursera',
    fees: 'paid',
    perks: 'Certificate + Portfolio Projects + Career Support',
    learning_type: 'course',
    event_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['web-development', 'full-stack', 'online', 'certificate'],
    domain: ['Web Development', 'Programming', 'Software Engineering']
  }
];

/**
 * Helper function to insert work opportunities
 */
async function seedWork(workType, data) {
  const sql = `
    INSERT INTO opportunities_work (
      work_type, title, apply_url, city, country, work_style,
      organization, company, stipend, duration, salary, experience,
      skills, tags, deadline, is_featured, is_verified, source
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    ON CONFLICT (work_type, apply_url) DO NOTHING
    RETURNING id, title
  `;

  let created = 0;
  let skipped = 0;

  for (const item of data) {
    try {
      const values = [
        workType,
        item.title,
        item.apply_url,
        item.city || null,
        item.country || null,
        item.work_style || null,
        item.organization || null,
        item.organization || null, // company = organization
        item.stipend || null,
        item.duration || null,
        item.salary || null,
        item.experience || null,
        item.skills || null,
        item.tags || null,
        item.deadline || null,
        item.is_featured || false,
        item.is_verified || false,
        'seed_script'
      ];

      const result = await pool.query(sql, values);
      
      if (result.rows.length > 0) {
        console.log(`  ✅ Created ${workType}: ${result.rows[0].title}`);
        created++;
      } else {
        console.log(`  ⚠️  Skipped (duplicate): ${item.title}`);
        skipped++;
      }
    } catch (err) {
      console.error(`  ❌ Failed to create ${workType}:`, item.title);
      console.error('     Error:', err.message);
    }
  }

  return { created, skipped };
}

/**
 * Helper function to insert event opportunities
 */
async function seedEvent(eventType, data) {
  const sql = `
    INSERT INTO opportunities_event (
      event_type, title, apply_url, city, country,
      organization, team_size, fees, perks, event_date,
      learning_type, deadline, tags, domain, is_featured, is_verified, source
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    ON CONFLICT (event_type, apply_url) DO NOTHING
    RETURNING id, title
  `;

  let created = 0;
  let skipped = 0;

  for (const item of data) {
    try {
      const values = [
        eventType,
        item.title,
        item.apply_url,
        item.city || null,
        item.country || null,
        item.organization || null,
        item.team_size || null,
        item.fees || null,
        item.perks || null,
        item.event_date || null,
        item.learning_type || null,
        item.deadline || null,
        item.tags || null,
        item.domain || null,
        item.is_featured || false,
        item.is_verified || false,
        'seed_script'
      ];

      const result = await pool.query(sql, values);
      
      if (result.rows.length > 0) {
        console.log(`  ✅ Created ${eventType}: ${result.rows[0].title}`);
        created++;
      } else {
        console.log(`  ⚠️  Skipped (duplicate): ${item.title}`);
        skipped++;
      }
    } catch (err) {
      console.error(`  ❌ Failed to create ${eventType}:`, item.title);
      console.error('     Error:', err.message);
    }
  }

  return { created, skipped };
}

/**
 * Main seed function
 */
async function seed() {
  console.log('\n🌱 Campus Connect Database Seeder');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    let totalCreated = 0;
    let totalSkipped = 0;

    // Seed internships
    console.log('📦 Seeding Internships...');
    const internResults = await seedWork('internship', sampleInternships);
    totalCreated += internResults.created;
    totalSkipped += internResults.skipped;

    // Seed jobs
    console.log('\n📦 Seeding Jobs...');
    const jobResults = await seedWork('job', sampleJobs);
    totalCreated += jobResults.created;
    totalSkipped += jobResults.skipped;

    // Seed hackathons
    console.log('\n📦 Seeding Hackathons...');
    const hackResults = await seedEvent('hackathon', sampleHackathons);
    totalCreated += hackResults.created;
    totalSkipped += hackResults.skipped;

    // Seed scholarships
    console.log('\n📦 Seeding Scholarships...');
    const scholarResults = await seedEvent('scholarship', sampleScholarships);
    totalCreated += scholarResults.created;
    totalSkipped += scholarResults.skipped;

    // Seed learning programs
    console.log('\n📦 Seeding Learning Programs...');
    const learningResults = await seedEvent('learning', sampleLearning);
    totalCreated += learningResults.created;
    totalSkipped += learningResults.skipped;

    // Get final counts
    const workCount = await pool.query('SELECT COUNT(*) FROM opportunities_work');
    const eventCount = await pool.query('SELECT COUNT(*) FROM opportunities_event');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Seed Process Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Created: ${totalCreated} new opportunities`);
    console.log(`⚠️  Skipped: ${totalSkipped} duplicates`);
    console.log('\n📈 Database Totals:');
    console.log(`   ├─ Work Opportunities:  ${workCount.rows[0].count}`);
    console.log(`   ├─ Event Opportunities: ${eventCount.rows[0].count}`);
    console.log(`   └─ Total:               ${parseInt(workCount.rows[0].count) + parseInt(eventCount.rows[0].count)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('💡 Next Steps:');
    console.log('   1. Start backend: cd backend && npm run dev');
    console.log('   2. Test API: curl http://localhost:5000/api/health');
    console.log('   3. View data: curl http://localhost:5000/api/internships\n');

  } catch (err) {
    console.error('\n❌ Seed Process Failed:');
    console.error('   Error:', err.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure database exists: createdb campus_connect');
    console.error('   2. Run schema: psql campus_connect < backend/schema.sql');
    console.error('   3. Check .env file in backend folder\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seed function
seed();