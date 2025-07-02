import supertest from 'supertest';
import app from '@backend/server';

const request = supertest(app);

describe('GET /api/health', () => {
    it('should return 200 OK', async () => {
        const res = await request.get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });
}); 