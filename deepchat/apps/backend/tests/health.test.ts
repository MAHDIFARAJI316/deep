import supertest from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let request: supertest.SuperTest<supertest.Test>;
let mongoServer: MongoMemoryServer;
let app: any;

describe('GET /api/health', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        process.env.MONGO_URI = mongoServer.getUri();
        const mod = await import('@backend/server');
        app = mod.default;
        request = supertest(app);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should return 200 OK', async () => {
        const res = await request.get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });
});
