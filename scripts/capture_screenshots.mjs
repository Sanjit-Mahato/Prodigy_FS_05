import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.resolve('screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function capture() {
  console.log('🚀 Launching Chrome for Retina LinkedIn Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1440,
    height: 900,
    deviceScaleFactor: 2, // Retina 2x scale for ultra crisp text and visuals
  });

  // 1. Landing Page - Hero View
  console.log('📸 1/9 Capturing Landing Page Hero...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1500);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '01_landing_hero.png'),
  });

  // 2. Landing Page - Showcase & Features
  console.log('📸 2/9 Capturing Landing Page Showcase...');
  await page.evaluate(() => {
    window.scrollTo({ top: 1200, behavior: 'instant' });
  });
  await sleep(1500);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '02_landing_showcase.png'),
  });

  // 3. Authenticate as Alex Rivera (demo persona)
  console.log('🔑 Authenticating demo persona (Alex Rivera)...');
  await page.evaluate(async () => {
    await fetch('/api/auth/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'alex_r' }),
    });
  });

  // 4. Main Feed (Dark Theme)
  console.log('📸 3/9 Capturing Main Social Feed (Dark Mode)...');
  await page.goto(`${BASE_URL}/feed`, { waitUntil: 'networkidle2' });
  await sleep(2000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '03_social_feed_dark.png'),
  });

  // 5. Creator Profile (Sarah Chen - Photographer)
  console.log('📸 4/9 Capturing Creator Profile (Sarah Chen)...');
  await page.goto(`${BASE_URL}/sarah_c`, { waitUntil: 'networkidle2' });
  await sleep(2000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '04_creator_profile_sarah.png'),
  });

  // 6. User Profile (Alex Rivera - UI Architect)
  console.log('📸 5/9 Capturing User Profile (Alex Rivera)...');
  await page.goto(`${BASE_URL}/alex_r`, { waitUntil: 'networkidle2' });
  await sleep(2000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '05_user_profile_alex.png'),
  });

  // 7. Explore & Trending Page
  console.log('📸 6/9 Capturing Explore & Trending Discovery...');
  await page.goto(`${BASE_URL}/explore`, { waitUntil: 'networkidle2' });
  await sleep(2000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '06_explore_trending.png'),
  });

  // 8. Notifications Center
  console.log('📸 7/9 Capturing Notifications Center...');
  await page.goto(`${BASE_URL}/notifications`, { waitUntil: 'networkidle2' });
  await sleep(2000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '07_notifications_center.png'),
  });

  // 8. Single Post Discussion Thread (With Open Comments)
  console.log('📸 8/11 Capturing Single Post Discussion Thread with Comments...');
  await page.goto(`${BASE_URL}/posts/cmveatisl000zf7dsnodsuvnt`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  await page.evaluate(() => {
    window.scrollTo({ top: 320, behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '08_post_discussion_thread.png'),
  });

  // 9. Interactive Follower Modal
  console.log('📸 9/11 Capturing Social Graph Modal (Followers)...');
  await page.goto(`${BASE_URL}/sarah_c`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const followersBtn = buttons.find((b) => b.textContent && b.textContent.toLowerCase().includes('followers'));
    if (followersBtn) followersBtn.click();
  });
  await sleep(1000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '09_followers_social_graph_modal.png'),
  });

  // 10. Edit Profile Modal (Alex Rivera)
  console.log('📸 10/11 Capturing Edit Profile Modal (Alex Rivera)...');
  await page.goto(`${BASE_URL}/alex_r`, { waitUntil: 'networkidle2' });
  await sleep(1500);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const editBtn = buttons.find((b) => b.textContent && b.textContent.toLowerCase().includes('edit profile'));
    if (editBtn) editBtn.click();
  });
  await sleep(1000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '10_edit_profile_modal.png'),
  });

  // 11. Light Theme Main Feed
  console.log('📸 11/11 Capturing Light Theme Feed...');
  await page.goto(`${BASE_URL}/feed`, { waitUntil: 'networkidle2' });
  await sleep(1000);
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  });
  await sleep(1000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, '11_social_feed_light.png'),
  });

  await browser.close();
  console.log('✨ All 11 screenshots captured successfully in screenshots/');
}

capture().catch((err) => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
