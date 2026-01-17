// backend/src/utils/validators.js
// Purpose: Input validation functions for API requests
// Validates data before it reaches the database

/**
 * Validate URL format
 * Ensures URL is valid HTTP/HTTPS and not localhost
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Reject localhost and private IPs (security)
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.match(/^192\.168\./) ||
      hostname.match(/^10\./) ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
    ) {
      return false;
    }
    
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Validate work opportunity data (internship or job)
 * 
 * @param {Object} data - Opportunity data
 * @param {string} workType - 'internship' or 'job'
 * @returns {Object} Validation result with errors array
 */
const validateWorkOpportunity = (data, workType) => {
  const errors = [];

  // Required: Title
  if (!data.title || typeof data.title !== 'string') {
    errors.push({ field: 'title', message: 'Title is required and must be a string' });
  } else if (data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title cannot be empty' });
  } else if (data.title.length > 500) {
    errors.push({ field: 'title', message: 'Title must be less than 500 characters' });
  }

  // Required: Apply URL
  if (!data.apply_url) {
    errors.push({ field: 'apply_url', message: 'apply_url is required' });
  } else if (!isValidUrl(data.apply_url)) {
    errors.push({ 
      field: 'apply_url', 
      message: 'apply_url must be a valid HTTP/HTTPS URL (not localhost)' 
    });
  }

  // Optional: City
  if (data.city && data.city.length > 100) {
    errors.push({ field: 'city', message: 'City must be less than 100 characters' });
  }

  // Optional: Country
  if (data.country && data.country.length > 100) {
    errors.push({ field: 'country', message: 'Country must be less than 100 characters' });
  }

  // Optional: Work style
  if (data.work_style && !['remote', 'hybrid', 'onsite'].includes(data.work_style.toLowerCase())) {
    errors.push({ 
      field: 'work_style', 
      message: 'work_style must be one of: remote, hybrid, onsite' 
    });
  }

  // Optional: Image URL
  if (data.image_url && !isValidUrl(data.image_url)) {
    errors.push({ field: 'image_url', message: 'image_url must be a valid URL' });
  }

  // Optional: Deadline (must be future date)
  if (data.deadline) {
    const deadlineDate = new Date(data.deadline);
    if (isNaN(deadlineDate.getTime())) {
      errors.push({ field: 'deadline', message: 'Invalid deadline format (use ISO 8601)' });
    } else if (deadlineDate < new Date()) {
      errors.push({ field: 'deadline', message: 'Deadline must be a future date' });
    }
  }

  // Optional: Tags (max 10)
  if (data.tags) {
    if (!Array.isArray(data.tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array' });
    } else if (data.tags.length > 10) {
      errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' });
    }
  }

  // Optional: Skills (max 20)
  if (data.skills) {
    if (!Array.isArray(data.skills)) {
      errors.push({ field: 'skills', message: 'Skills must be an array' });
    } else if (data.skills.length > 20) {
      errors.push({ field: 'skills', message: 'Maximum 20 skills allowed' });
    }
  }

  // Type-specific validations
  if (workType === 'internship') {
    // Internship should have stipend and duration
    if (data.stipend && data.stipend.length > 100) {
      errors.push({ field: 'stipend', message: 'Stipend must be less than 100 characters' });
    }
    if (data.duration && data.duration.length > 50) {
      errors.push({ field: 'duration', message: 'Duration must be less than 50 characters' });
    }
  }

  if (workType === 'job') {
    // Job should have salary and experience
    if (data.salary && data.salary.length > 100) {
      errors.push({ field: 'salary', message: 'Salary must be less than 100 characters' });
    }
    if (data.experience && data.experience.length > 100) {
      errors.push({ field: 'experience', message: 'Experience must be less than 100 characters' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate event opportunity data (hackathon, learning, scholarship)
 * 
 * @param {Object} data - Opportunity data
 * @param {string} eventType - 'hackathon', 'learning', or 'scholarship'
 * @returns {Object} Validation result with errors array
 */
const validateEventOpportunity = (data, eventType) => {
  const errors = [];

  // Required: Title
  if (!data.title || typeof data.title !== 'string') {
    errors.push({ field: 'title', message: 'Title is required and must be a string' });
  } else if (data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title cannot be empty' });
  } else if (data.title.length > 500) {
    errors.push({ field: 'title', message: 'Title must be less than 500 characters' });
  }

  // Required: Apply URL
  if (!data.apply_url) {
    errors.push({ field: 'apply_url', message: 'apply_url is required' });
  } else if (!isValidUrl(data.apply_url)) {
    errors.push({ 
      field: 'apply_url', 
      message: 'apply_url must be a valid HTTP/HTTPS URL (not localhost)' 
    });
  }

  // Optional: City
  if (data.city && data.city.length > 100) {
    errors.push({ field: 'city', message: 'City must be less than 100 characters' });
  }

  // Optional: Country
  if (data.country && data.country.length > 100) {
    errors.push({ field: 'country', message: 'Country must be less than 100 characters' });
  }

  // Optional: Image URL
  if (data.image_url && !isValidUrl(data.image_url)) {
    errors.push({ field: 'image_url', message: 'image_url must be a valid URL' });
  }

  // Optional: Fees
  if (data.fees && !['paid', 'unpaid'].includes(data.fees.toLowerCase())) {
    errors.push({ 
      field: 'fees', 
      message: 'fees must be either "paid" or "unpaid"' 
    });
  }

  // Optional: Learning type (for learning programs)
  if (data.learning_type) {
    const validTypes = ['workshop', 'course', 'bootcamp', 'mentorship'];
    if (!validTypes.includes(data.learning_type.toLowerCase())) {
      errors.push({ 
        field: 'learning_type', 
        message: `learning_type must be one of: ${validTypes.join(', ')}` 
      });
    }
  }

  // Optional: Deadline
  if (data.deadline) {
    const deadlineDate = new Date(data.deadline);
    if (isNaN(deadlineDate.getTime())) {
      errors.push({ field: 'deadline', message: 'Invalid deadline format (use ISO 8601)' });
    } else if (deadlineDate < new Date()) {
      errors.push({ field: 'deadline', message: 'Deadline must be a future date' });
    }
  }

  // Optional: Event date
  if (data.event_date) {
    const eventDate = new Date(data.event_date);
    if (isNaN(eventDate.getTime())) {
      errors.push({ field: 'event_date', message: 'Invalid event_date format (use ISO 8601)' });
    }
  }

  // Optional: Tags (max 10)
  if (data.tags) {
    if (!Array.isArray(data.tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array' });
    } else if (data.tags.length > 10) {
      errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' });
    }
  }

  // Optional: Domain (max 10)
  if (data.domain) {
    if (!Array.isArray(data.domain)) {
      errors.push({ field: 'domain', message: 'Domain must be an array' });
    } else if (data.domain.length > 10) {
      errors.push({ field: 'domain', message: 'Maximum 10 domains allowed' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate pagination parameters
 * 
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {number} maxLimit - Maximum allowed limit
 * @returns {Object} Validated and sanitized pagination params
 */
const validatePagination = (page, limit, maxLimit = 50) => {
  const sanitizedPage = Math.max(1, parseInt(page) || 1);
  const sanitizedLimit = Math.min(
    maxLimit,
    Math.max(1, parseInt(limit) || 10)
  );

  return {
    page: sanitizedPage,
    limit: sanitizedLimit
  };
};

/**
 * Sanitize text input (remove HTML, trim whitespace)
 * 
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, ''); // Remove all HTML tags
};

/**
 * Validate UUID format
 * 
 * @param {string} id - UUID to validate
 * @returns {boolean} True if valid UUID
 */
const isValidUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

module.exports = {
  isValidUrl,
  validateWorkOpportunity,
  validateEventOpportunity,
  validatePagination,
  sanitizeText,
  isValidUUID
};