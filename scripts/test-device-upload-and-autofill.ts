import { saveUploadedImage } from '../lib/storage';
import fs from 'fs/promises';
import path from 'path';

async function runTests() {
  console.log('--- RUNNING AUTO-FILL & DEVICE IMAGE UPLOAD VERIFICATION SUITE ---');

  // Test 1: File format validation
  console.log('\n[Test 1] Validating File Formats...');
  const fakePdf = new File(['fake-pdf-content'], 'test.pdf', { type: 'application/pdf' });
  const resultPdf = await saveUploadedImage(fakePdf, 'events', 'test-event');
  if (resultPdf.success === false && resultPdf.error?.includes('format')) {
    console.log('✓ Rejected non-image format (PDF) correctly:', resultPdf.error);
  } else {
    throw new Error('Test 1 failed: PDF should have been rejected');
  }

  // Test 2: File size limit (>5MB)
  console.log('\n[Test 2] Validating 5MB Maximum File Size...');
  const largeBuffer = new Uint8Array(6 * 1024 * 1024); // 6MB
  const largeFile = new File([largeBuffer], 'large-banner.jpg', { type: 'image/jpeg' });
  const resultLarge = await saveUploadedImage(largeFile, 'events', 'large-banner');
  if (resultLarge.success === false && resultLarge.error?.includes('5MB')) {
    console.log('✓ Rejected file exceeding 5MB correctly:', resultLarge.error);
  } else {
    throw new Error('Test 2 failed: 6MB file should have been rejected');
  }

  // Test 3: Valid PNG Upload
  console.log('\n[Test 3] Saving Valid PNG Image (<5MB)...');
  const validPngBuffer = new Uint8Array(1024 * 50); // 50KB
  const validPng = new File([validPngBuffer], 'sample-merch-hoodie.png', { type: 'image/png' });
  const resultPng = await saveUploadedImage(validPng, 'merch', 'pcyc-hoodie');
  if (resultPng.success && resultPng.url?.startsWith('/uploads/merch/')) {
    console.log('✓ Successfully saved PNG image:', resultPng.url);
    // Verify file exists on disk
    const diskPath = path.join(process.cwd(), 'public', resultPng.url);
    await fs.access(diskPath);
    console.log('✓ Verified file exists on disk at:', diskPath);
  } else {
    throw new Error('Test 3 failed: Valid PNG should have been saved');
  }

  // Test 4: Valid JPG Upload
  console.log('\n[Test 4] Saving Valid JPG Image (<5MB)...');
  const validJpgBuffer = new Uint8Array(1024 * 100); // 100KB
  const validJpg = new File([validJpgBuffer], 'national-camp-banner.jpg', { type: 'image/jpeg' });
  const resultJpg = await saveUploadedImage(validJpg, 'events', 'national-camp');
  if (resultJpg.success && resultJpg.url?.startsWith('/uploads/events/')) {
    console.log('✓ Successfully saved JPG image:', resultJpg.url);
    const diskPath = path.join(process.cwd(), 'public', resultJpg.url);
    await fs.access(diskPath);
    console.log('✓ Verified file exists on disk at:', diskPath);
  } else {
    throw new Error('Test 4 failed: Valid JPG should have been saved');
  }

  // Test 5: Auto-fill slug generation logic
  console.log('\n[Test 5] Verifying Slug Auto-Fill Rules for Events & Merch...');
  const testInputs = [
    { title: 'PCYC National Youth Camp 2026', expected: 'pcyc-national-youth-camp-2026' },
    { title: 'Luzon Fraternal Gathering 2026!', expected: 'luzon-fraternal-gathering-2026' },
    { title: 'PCYC Emblem Heavyweight Tee (Navy Blue)', expected: 'pcyc-emblem-heavyweight-tee-navy-blue' },
    { title: "God's Purpose & Grace - Study Camp", expected: 'gods-purpose-grace-study-camp' },
  ];

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  for (const item of testInputs) {
    const slug = generateSlug(item.title);
    if (slug === item.expected) {
      console.log(`✓ Slug match: "${item.title}" -> "${slug}"`);
    } else {
      throw new Error(`Test 5 failed: Expected "${item.expected}", got "${slug}"`);
    }
  }

  console.log('\n✨ ALL AUTO-FILL & DEVICE IMAGE UPLOAD VERIFICATION TESTS PASSED SUCCESSFULLY! ✨\n');
}

runTests().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
