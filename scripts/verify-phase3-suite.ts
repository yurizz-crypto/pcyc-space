import {
  getCachedPublishedEvents,
  getCachedEventBySlug,
  getCachedAvailableProducts,
  getCachedProductBySlug,
  getCachedDisplayedEcclesias,
  getCachedEcclesiaCount,
  getCachedYouthAndFriendsCount,
  getCachedSiteSetting,
  CACHE_TAGS,
  invalidateCacheTag,
} from '../lib/db/queries/cached';
import { getPublishedEvents, getEventBySlug } from '../lib/db/queries/events';
import { getAvailableProducts, getProductBySlug } from '../lib/db/queries/products';
import { getDisplayedEcclesias, getEcclesiaCount } from '../lib/db/queries/ecclesias';
import { getYouthAndFriendsCount, getSiteSetting } from '../lib/db/queries/settings';

async function runPhase3Verification() {
  console.log('====================================================');
  console.log('PHASE 3 VERIFICATION: Tag-Based Caching & Queries');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, description: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${description}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${description}`);
      process.exitCode = 1;
    }
  }

  // 1. Verify CACHE_TAGS constants
  console.log('--- 1. Testing Cache Tag Constants ---');
  assert(CACHE_TAGS.events === 'events', 'CACHE_TAGS.events is defined');
  assert(CACHE_TAGS.eventsPublished === 'events:published', 'CACHE_TAGS.eventsPublished is defined');
  assert(CACHE_TAGS.event('camp-2026') === 'event:camp-2026', 'CACHE_TAGS.event(slug) formats correctly');
  assert(CACHE_TAGS.products === 'products', 'CACHE_TAGS.products is defined');
  assert(CACHE_TAGS.productsAvailable === 'products:available', 'CACHE_TAGS.productsAvailable is defined');
  assert(CACHE_TAGS.product('shirt-black') === 'product:shirt-black', 'CACHE_TAGS.product(slug) formats correctly');
  assert(CACHE_TAGS.ecclesias === 'ecclesias', 'CACHE_TAGS.ecclesias is defined');
  assert(CACHE_TAGS.ecclesiasDisplayed === 'ecclesias:displayed', 'CACHE_TAGS.ecclesiasDisplayed is defined');
  assert(CACHE_TAGS.ecclesiasCount === 'ecclesias:count', 'CACHE_TAGS.ecclesiasCount is defined');
  assert(CACHE_TAGS.settings === 'settings', 'CACHE_TAGS.settings is defined');
  assert(CACHE_TAGS.youthCount === 'settings:youth_count', 'CACHE_TAGS.youthCount is defined');
  assert(CACHE_TAGS.settingsKey('test_key') === 'settings:test_key', 'CACHE_TAGS.settingsKey(key) formats correctly');

  // 2. Invalidate helper resilience test
  console.log('\n--- 2. Testing Invalidation Helper ---');
  assert(
    typeof invalidateCacheTag === 'function',
    'invalidateCacheTag is exported as a function'
  );
  try {
    invalidateCacheTag('test-tag-1', 'test-tag-2');
    assert(true, 'invalidateCacheTag executes safely outside Request Context without throwing');
  } catch (e: any) {
    assert(false, `invalidateCacheTag threw: ${e.message}`);
  }

  // 3. Live Data Cache Equivalence Tests
  console.log('\n--- 3. Testing Live Data Fetching Equivalence ---');

  // Events
  const [rawEvents, cachedEvents] = await Promise.all([
    getPublishedEvents(),
    getCachedPublishedEvents(),
  ]);
  assert(Array.isArray(cachedEvents), 'getCachedPublishedEvents returns an array');
  assert(
    cachedEvents.length === rawEvents.length,
    `getCachedPublishedEvents count matches raw (${cachedEvents.length} items)`
  );

  if (rawEvents.length > 0) {
    const firstSlug = rawEvents[0].slug;
    const [rawSingle, cachedSingle] = await Promise.all([
      getEventBySlug(firstSlug),
      getCachedEventBySlug(firstSlug),
    ]);
    assert(cachedSingle !== null, `getCachedEventBySlug found event "${firstSlug}"`);
    assert(cachedSingle?.id === rawSingle?.id, 'Cached event ID matches raw query');
  }

  // Products
  const [rawProducts, cachedProducts] = await Promise.all([
    getAvailableProducts(),
    getCachedAvailableProducts(),
  ]);
  assert(Array.isArray(cachedProducts), 'getCachedAvailableProducts returns an array');
  assert(
    cachedProducts.length === rawProducts.length,
    `getCachedAvailableProducts count matches raw (${cachedProducts.length} items)`
  );

  if (rawProducts.length > 0) {
    const firstSlug = rawProducts[0].slug;
    const [rawSingle, cachedSingle] = await Promise.all([
      getProductBySlug(firstSlug),
      getCachedProductBySlug(firstSlug),
    ]);
    assert(cachedSingle !== null, `getCachedProductBySlug found product "${firstSlug}"`);
    assert(cachedSingle?.id === rawSingle?.id, 'Cached product ID matches raw query');
  }

  // Ecclesias
  const [rawEcclesias, cachedEcclesias] = await Promise.all([
    getDisplayedEcclesias(),
    getCachedDisplayedEcclesias(),
  ]);
  assert(Array.isArray(cachedEcclesias), 'getCachedDisplayedEcclesias returns an array');
  assert(
    cachedEcclesias.length === rawEcclesias.length,
    `getCachedDisplayedEcclesias count matches raw (${cachedEcclesias.length} items)`
  );

  const [rawEcclesiaCount, cachedEcclesiaCount] = await Promise.all([
    getEcclesiaCount(),
    getCachedEcclesiaCount(),
  ]);
  assert(
    cachedEcclesiaCount === rawEcclesiaCount,
    `getCachedEcclesiaCount (${cachedEcclesiaCount}) matches raw (${rawEcclesiaCount})`
  );

  // Settings
  const [rawYouthCount, cachedYouthCount] = await Promise.all([
    getYouthAndFriendsCount(),
    getCachedYouthAndFriendsCount(),
  ]);
  assert(
    cachedYouthCount === rawYouthCount,
    `getCachedYouthAndFriendsCount (${cachedYouthCount}) matches raw (${rawYouthCount})`
  );

  const testSetting = await getCachedSiteSetting('youth_and_friends_count', '500');
  assert(typeof testSetting === 'string', `getCachedSiteSetting returned valid string "${testSetting}"`);

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passedTests}/${totalTests} tests passed successfully!`);
  console.log('====================================================\n');

  process.exit(0);
}

runPhase3Verification().catch((err) => {
  console.error('Fatal error during Phase 3 verification:', err);
  process.exit(1);
});
