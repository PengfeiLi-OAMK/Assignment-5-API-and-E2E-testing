import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRandomDogImage } from '../services/dogService';

describe('getRandomDogImage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns success response with mapped imageUrl and calls fetch once', async () => {
    const mockedApiResponse = {
      message: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
      status: 'success'
    };

    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockedApiResponse
    } as Response);

    const result = await getRandomDogImage();

    expect(result.imageUrl).toBe(mockedApiResponse.message);
    expect(result.status).toBe('success');
    expect(fetchMock).toHaveBeenCalledOnce();
  });
 

  it('throws an error when the API response is not ok', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500
    } as Response);
    
    await expect(getRandomDogImage()).rejects.toThrow('Failed to fetch dog image: Dog API returned status 500');
  });

});
