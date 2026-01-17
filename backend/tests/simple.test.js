const request = require('supertest');
const app = require('../src/app');

describe('Basic API Tests', () => {
  
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api', () => {
    it('should return API documentation', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('documentation');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/internships', () => {
    it('should return internships list', async () => {
      const response = await request(app)
        .get('/api/internships')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/jobs', () => {
    it('should return jobs list', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('404 Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent-route')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('CORS', () => {
    it('should include CORS or Vary headers', async () => {
      const response = await request(app)
        .get('/api')
        .set('Origin', 'http://localhost:3000');

      // Check for Vary header which indicates CORS is configured
      expect(response.headers).toHaveProperty('vary');
    });
  });
});

// Clean up after tests - Don't close pool, it's shared
afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});