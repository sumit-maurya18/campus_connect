-- ============================================
-- Campus Connect Database Schema
-- Two-Table Architecture: Work vs Event
-- Author: Campus Connect Team
-- Version: 1.0.0
-- ============================================

-- Drop existing tables (for clean reinstall)
DROP TABLE IF EXISTS opportunities_event CASCADE;
DROP TABLE IF EXISTS opportunities_work CASCADE;

-- ============================================
-- TABLE 1: opportunities_work
-- Stores: Internships and Jobs
-- Retention: DELETE after 5 days (or deadline+1)
-- ============================================

CREATE TABLE opportunities_work (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Type Differentiator (internship or job)
  work_type VARCHAR(20) NOT NULL CHECK (work_type IN ('internship', 'job')),
  
  -- Required Core Fields
  title VARCHAR(500) NOT NULL CHECK (LENGTH(TRIM(title)) > 0),
  apply_url TEXT NOT NULL CHECK (apply_url ~* '^https?://'),
  
  -- Location Fields (Optional)
  city VARCHAR(100),
  country VARCHAR(100),
  work_style VARCHAR(10) CHECK (work_style IN ('remote', 'hybrid', 'onsite')),
  
  -- Organization Details
  organization VARCHAR(200),
  company VARCHAR(200),
  image_url TEXT CHECK (image_url IS NULL OR image_url ~* '^https?://'),
  
  -- Work-Specific Fields
  stipend VARCHAR(100),       -- For internships
  duration VARCHAR(50),       -- For internships
  salary VARCHAR(100),        -- For jobs
  experience VARCHAR(100),    -- For jobs
  skills TEXT[],              -- Array of skills
  who_can_apply VARCHAR(255), -- Eligibility
  
  -- Deadline
  deadline TIMESTAMPTZ,
  
  -- Metadata
  tags TEXT[],
  source VARCHAR(100) DEFAULT 'manual',
  external_id VARCHAR(255),
  
  -- Status & Features
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
  
  -- Timestamps
  posted_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_seen_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Unique Constraints
  CONSTRAINT unique_work_url UNIQUE(work_type, apply_url),
  CONSTRAINT unique_work_external_id UNIQUE(external_id)
);

-- Add table comment
COMMENT ON TABLE opportunities_work IS 'Stores work opportunities (internships and jobs) with 5-day retention policy';

-- ============================================
-- TABLE 2: opportunities_event
-- Stores: Hackathons, Learning, Scholarships
-- Retention: ARCHIVE first, keep longer
-- ============================================

CREATE TABLE opportunities_event (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Type Differentiator
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('hackathon', 'learning', 'scholarship')),
  
  -- Required Core Fields
  title VARCHAR(500) NOT NULL CHECK (LENGTH(TRIM(title)) > 0),
  apply_url TEXT NOT NULL CHECK (apply_url ~* '^https?://'),
  
  -- Location Fields
  city VARCHAR(100),
  country VARCHAR(100),
  
  -- Organization
  organization VARCHAR(200),
  image_url TEXT CHECK (image_url IS NULL OR image_url ~* '^https?://'),
  
  -- Event-Specific Fields
  team_size VARCHAR(50),
  fees VARCHAR(20) CHECK (fees IN ('paid', 'unpaid')),
  perks TEXT,
  event_date TIMESTAMPTZ,
  learning_type VARCHAR(50) CHECK (learning_type IN ('workshop', 'course', 'bootcamp', 'mentorship')),
  
  -- Deadline
  deadline TIMESTAMPTZ,
  
  -- Metadata
  tags TEXT[],
  domain TEXT[],
  source VARCHAR(100) DEFAULT 'manual',
  external_id VARCHAR(255),
  
  -- Status & Features
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'archived')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0 CHECK (view_count >= 0),
  
  -- Timestamps
  posted_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_seen_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Unique Constraints
  CONSTRAINT unique_event_url UNIQUE(event_type, apply_url),
  CONSTRAINT unique_event_external_id UNIQUE(external_id)
);

COMMENT ON TABLE opportunities_event IS 'Stores event opportunities (hackathons, learning, scholarships) with archive-first retention';

-- ============================================
-- INDEXES: opportunities_work
-- Purpose: Speed up common queries
-- ============================================

-- Primary indexes for filtering
CREATE INDEX idx_work_type ON opportunities_work(work_type);
CREATE INDEX idx_work_status ON opportunities_work(status);
CREATE INDEX idx_work_posted_date ON opportunities_work(posted_date DESC);
CREATE INDEX idx_work_deadline ON opportunities_work(deadline) WHERE deadline IS NOT NULL;

-- Composite indexes for common query patterns
CREATE INDEX idx_work_type_status ON opportunities_work(work_type, status);
CREATE INDEX idx_work_status_posted ON opportunities_work(status, posted_date DESC);

-- Location indexes
CREATE INDEX idx_work_city ON opportunities_work(city) WHERE city IS NOT NULL;
CREATE INDEX idx_work_country ON opportunities_work(country) WHERE country IS NOT NULL;
CREATE INDEX idx_work_work_style ON opportunities_work(work_style) WHERE work_style IS NOT NULL;

-- Array indexes (GIN for array containment queries)
CREATE INDEX idx_work_skills ON opportunities_work USING GIN(skills);
CREATE INDEX idx_work_tags ON opportunities_work USING GIN(tags);

-- Full-text search index
CREATE INDEX idx_work_search ON opportunities_work USING GIN(
  to_tsvector('english', 
    title || ' ' || 
    COALESCE(organization, '') || ' ' || 
    COALESCE(company, '')
  )
);

-- ============================================
-- INDEXES: opportunities_event
-- ============================================

CREATE INDEX idx_event_type ON opportunities_event(event_type);
CREATE INDEX idx_event_status ON opportunities_event(status);
CREATE INDEX idx_event_posted_date ON opportunities_event(posted_date DESC);
CREATE INDEX idx_event_deadline ON opportunities_event(deadline) WHERE deadline IS NOT NULL;
CREATE INDEX idx_event_event_date ON opportunities_event(event_date) WHERE event_date IS NOT NULL;

CREATE INDEX idx_event_type_status ON opportunities_event(event_type, status);
CREATE INDEX idx_event_status_posted ON opportunities_event(status, posted_date DESC);

CREATE INDEX idx_event_city ON opportunities_event(city) WHERE city IS NOT NULL;
CREATE INDEX idx_event_country ON opportunities_event(country) WHERE country IS NOT NULL;
CREATE INDEX idx_event_fees ON opportunities_event(fees) WHERE fees IS NOT NULL;

CREATE INDEX idx_event_tags ON opportunities_event USING GIN(tags);
CREATE INDEX idx_event_domain ON opportunities_event USING GIN(domain);

CREATE INDEX idx_event_search ON opportunities_event USING GIN(
  to_tsvector('english', 
    title || ' ' || 
    COALESCE(organization, '')
  )
);

-- ============================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS: Apply auto-update function
-- ============================================

CREATE TRIGGER trigger_work_updated_at
  BEFORE UPDATE ON opportunities_work
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_event_updated_at
  BEFORE UPDATE ON opportunities_event
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTION: Get opportunity statistics
-- ============================================

CREATE OR REPLACE FUNCTION get_opportunity_stats()
RETURNS TABLE(
  table_name VARCHAR,
  type VARCHAR,
  active_count BIGINT,
  expired_count BIGINT,
  archived_count BIGINT,
  featured_count BIGINT,
  total_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  -- Work opportunities
  SELECT 
    'opportunities_work'::VARCHAR as table_name,
    work_type::VARCHAR as type,
    COUNT(*) FILTER (WHERE status = 'active') as active_count,
    COUNT(*) FILTER (WHERE status = 'expired') as expired_count,
    0::BIGINT as archived_count,
    COUNT(*) FILTER (WHERE is_featured = TRUE) as featured_count,
    COUNT(*) as total_count
  FROM opportunities_work
  GROUP BY work_type
  
  UNION ALL
  
  -- Event opportunities
  SELECT 
    'opportunities_event'::VARCHAR as table_name,
    event_type::VARCHAR as type,
    COUNT(*) FILTER (WHERE status = 'active') as active_count,
    COUNT(*) FILTER (WHERE status = 'expired') as expired_count,
    COUNT(*) FILTER (WHERE status = 'archived') as archived_count,
    COUNT(*) FILTER (WHERE is_featured = TRUE) as featured_count,
    COUNT(*) as total_count
  FROM opportunities_event
  GROUP BY event_type;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- List all tables
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_name IN ('opportunities_work', 'opportunities_event');
  
  IF table_count = 2 THEN
    RAISE NOTICE '✅ Tables created successfully: opportunities_work, opportunities_event';
  ELSE
    RAISE EXCEPTION 'Table creation failed. Expected 2 tables, found %', table_count;
  END IF;
END $$;

-- List all indexes
DO $$
DECLARE
  index_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes 
  WHERE schemaname = 'public'
    AND tablename IN ('opportunities_work', 'opportunities_event');
  
  RAISE NOTICE 'Created % indexes for optimal query performance', index_count;
END $$;

-- Final success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '----------------------------------------------------------';
  RAISE NOTICE 'Campus Connect Database Schema Setup Complete!';
  RAISE NOTICE '----------------------------------------------------------';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables: opportunities_work, opportunities_event';
  RAISE NOTICE 'Indexes: Optimized for fast queries';
  RAISE NOTICE 'Triggers: Auto-update timestamps';
  RAISE NOTICE 'Functions: Statistics and helpers';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '   1. Run seed script: npm run seed';
  RAISE NOTICE '   2. Start backend: npm run dev';
  RAISE NOTICE '';
  RAISE NOTICE '----------------------------------------------------------';
END $$;