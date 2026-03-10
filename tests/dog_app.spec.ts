import { expect, test } from '@playwright/test';

test('Test 3: dog image is retrieved successfully when page is loaded', async ({ page }) => {
  const dogApiResponsePromise = page.waitForResponse((response) => {
    return response.url().includes('/api/dogs/random') && response.status() === 200;
  });

  await page.goto('/');
  await dogApiResponsePromise;

  const dogImage = page.locator('img.dog-image');
  await expect(dogImage).toBeVisible();

  const src = await dogImage.getAttribute('src');
  expect(src).toBeTruthy();
  expect(src).toMatch(/^https:\/\//);
});

test('Test 4: dog image is retrieved successfully when button is clicked', async ({ page }) => {
  const initialDogApiResponsePromise = page.waitForResponse((response) => {
    return response.url().includes('/api/dogs/random') && response.status() === 200;
  });

  await page.goto('/');
  await initialDogApiResponsePromise;

  const fetchButton = page.getByRole('button', { name: 'Get Another Dog' });
  await expect(fetchButton).toBeEnabled();

  const dogApiResponsePromiseAfterClick = page.waitForResponse((response) => {
    return response.url().includes('/api/dogs/random') && response.status() === 200;
  });

  await fetchButton.click();
  await dogApiResponsePromiseAfterClick;

  const dogImage = page.locator('img.dog-image');
  await expect(dogImage).toBeVisible();

  const src = await dogImage.getAttribute('src');
  expect(src).toBeTruthy();
  expect(src).toMatch(/^https:\/\//);
});

test('Test 5: shows error text when API call fails', async ({ page }) => {
  await page.route('**/api/dogs/random', async (route) => {
    await route.abort();
  });

  await page.goto('/');

  const errorElement = page.getByText(/error/i);
  await expect(errorElement.first()).toBeVisible();
});
