import express from 'express';
import type { Request, Response } from 'express';
import request from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';
import dogRoutes from '../routes/dogRoutes';

const mockedDogResponse = {
  success: true,
  data: {
    imageUrl: 'https://images.dog.ceo/breeds/stbernard/n02109525_15579.jpg',
    status: 'success'
  }
};

const mockedErrorResponse = {
  success: false,
  error: 'Failed to fetch dog image: Network error'
};

const { getDogImageMock } = vi.hoisted(() => ({
  getDogImageMock: vi.fn()
}));

vi.mock('../controllers/dogController', () => ({
  getDogImage: getDogImageMock
}));

describe('dogRoutes', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('GET /api/dogs/random returns mocked dog JSON', async () => {
    getDogImageMock.mockImplementationOnce((_req: Request, res: Response) => {
      res.status(200).json(mockedDogResponse);
    });

    const app = express();
    app.use('/api/dogs', dogRoutes);

    const res = await request(app).get('/api/dogs/random');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.imageUrl).toContain(mockedDogResponse.data.imageUrl);
    expect(getDogImageMock).toHaveBeenCalledOnce();
  });

  test('GET /api/dogs/random returns 500 and error message on failure', async () => {
    getDogImageMock.mockImplementationOnce((_req: Request, res: Response) => {
      res.status(500).json(mockedErrorResponse);
    });

    const app = express();
    app.use('/api/dogs', dogRoutes);

    const res = await request(app).get('/api/dogs/random');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Failed to fetch dog image: Network error');
    expect(getDogImageMock).toHaveBeenCalledOnce();
  });
});
