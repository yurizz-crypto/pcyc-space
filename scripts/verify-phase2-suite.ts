import { getPublishedEvents, getAllEvents } from '../lib/db/queries/events';
import { getAvailableProducts, getAllProducts } from '../lib/db/queries/products';
import { getDisplayedEcclesias, getEcclesiaCount } from '../lib/db/queries/ecclesias';
import { getYouthAndFriendsCount, getSiteSetting } from '../lib/db/queries/settings';
import { getAllOrdersWithReceipts } from '../lib/db/queries/orders';
import { getAllMembers } from '../lib/db/queries/users';

async function runPhase2ValidationSuite() {
  console.log('🧪 Starting Verification Pass 2: Live Query & Memoization Suite...\n');

  let passedTests = 0;
  let totalTests = 0;

  function assertTest(name: string, condition: boolean, details: string = '') {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${name} ${details}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${name} ${details}`);
    }
  }

  // Test 1: Events Queries
  const t0 = performance.now();
  const publishedEvents = await getPublishedEvents();
  const t1 = performance.now();
  assertTest('getPublishedEvents()', Array.isArray(publishedEvents), `(${publishedEvents.length} events, ${(t1 - t0).toFixed(2)}ms)`);

  const allEvents = await getAllEvents();
  assertTest('getAllEvents()', Array.isArray(allEvents), `(${allEvents.length} total events)`);

  // Test 2: Products Queries
  const t2 = performance.now();
  const availableProducts = await getAvailableProducts();
  const t3 = performance.now();
  assertTest('getAvailableProducts()', Array.isArray(availableProducts), `(${availableProducts.length} items, ${(t3 - t2).toFixed(2)}ms)`);

  const allProducts = await getAllProducts();
  assertTest('getAllProducts()', Array.isArray(allProducts), `(${allProducts.length} items)`);

  // Test 3: Ecclesias Queries
  const t4 = performance.now();
  const displayedEcclesias = await getDisplayedEcclesias();
  const t5 = performance.now();
  assertTest('getDisplayedEcclesias()', Array.isArray(displayedEcclesias), `(${displayedEcclesias.length} ecclesias, ${(t5 - t4).toFixed(2)}ms)`);

  const ecclesiaCount = await getEcclesiaCount();
  assertTest('getEcclesiaCount()', typeof ecclesiaCount === 'number' && ecclesiaCount >= 0, `(Count: ${ecclesiaCount})`);

  // Test 4: Settings Queries
  const youthCount = await getYouthAndFriendsCount();
  assertTest('getYouthAndFriendsCount()', typeof youthCount === 'number' && youthCount > 0, `(Metric: ${youthCount})`);

  const appName = await getSiteSetting('app_name', 'PCYC Space');
  assertTest('getSiteSetting()', typeof appName === 'string', `(Setting value: "${appName}")`);

  // Test 5: Orders Queries
  const t6 = performance.now();
  const allOrders = await getAllOrdersWithReceipts();
  const t7 = performance.now();
  assertTest('getAllOrdersWithReceipts()', Array.isArray(allOrders), `(${allOrders.length} orders with receipts, ${(t7 - t6).toFixed(2)}ms)`);

  // Test 6: Users Queries
  const allMembers = await getAllMembers();
  assertTest('getAllMembers()', Array.isArray(allMembers), `(${allMembers.length} profiles)`);

  console.log(`\n========================================`);
  console.log(`📊 Suite Results: ${passedTests}/${totalTests} tests passed (${((passedTests / totalTests) * 100).toFixed(0)}%)`);
  console.log(`========================================\n`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPhase2ValidationSuite().catch((err) => {
  console.error('Fatal Suite Error:', err);
  process.exit(1);
});
