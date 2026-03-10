import express from 'express';
import request from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';

const mockedServiceData = {
  imageUrl: 'https://images.dog.ceo/breeds/sheepdog-indian/Himalayan_Sheepdog.jpg',
  status: 'success'
};

const { getRandomDogImageMock } = vi.hoisted(() => ({
  getRandomDogImageMock: vi.fn()
}));

vi.mock('../services/dogService', () => ({
  getRandomDogImage: getRandomDogImageMock
}));

import dogRoutes from '../routes/dogRoutes';

describe('dog API', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('GET /api/dogs/random returns success true and dog image data', async () => {
    getRandomDogImageMock.mockResolvedValueOnce(mockedServiceData);

    const app = express();
    app.use('/api/dogs', dogRoutes);

    const res = await request(app).get('/api/dogs/random');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.imageUrl).toContain(mockedServiceData.imageUrl);
    expect(typeof res.body.data.imageUrl).toBe('string');
  });
});
