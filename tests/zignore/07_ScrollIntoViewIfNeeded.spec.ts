import { test, expect } from '@playwright/test';

test('Scroll and interact with a footer link', async ({ page }) => {
  await page.goto('https://example.com');

  const footerLink = page.getByRole('link', { name: 'Privacy Policy' });

  await footerLink.scrollIntoViewIfNeeded();  // 1. Scroll the element into the viewport only if it's not already visible
  await page.waitForTimeout(500); 
  await footerLink.click();
});

// click():       Automatically calls scrollIntoViewIfNeeded() before clicking.
// hover():       Automatically calls scrollIntoViewIfNeeded() before hovering.
// Manual Call:   Use it when you need the element to be visible without clicking it yet (e.g., for taking a screenshot or triggering a lazy-load event).