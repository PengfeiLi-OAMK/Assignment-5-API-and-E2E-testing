import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { getDogImage } from '../controllers/dogController';
import * as dogService from '../services/dogService';


describe('getDogImage', () => {
  it('returns success true and mocked dog data from service', async () => {
    const mockedDogData = {
      imageUrl: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success'
    };

    vi.spyOn(dogService, 'getRandomDogImage').mockResolvedValue(mockedDogData);

    const req = {} as Request;
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const res = { json, status } as unknown as Response;
   


    await getDogImage(req, res);

    expect(json).toHaveBeenCalledWith({
      success: true,
      data: mockedDogData
    });
  });
});
