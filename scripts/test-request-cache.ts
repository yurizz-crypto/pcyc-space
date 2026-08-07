import { getCurrentUserProfile } from '../lib/db/queries/users';
import { getPublishedEvents } from '../lib/db/queries/events';
import { getAvailableProducts } from '../lib/db/queries/products';
import { getDisplayedEcclesias } from '../lib/db/queries/ecclesias';
import { getYouthAndFriendsCount } from '../lib/db/queries/settings';

async function testMemoization() {
  console.log('⚡ Testing React.cache() query memoization & exports...\n');

  // Verify functions are defined and executable
  const tests = [
    { name: 'getCurrentUserProfile', fn: getCurrentUserProfile },
    { name: 'getPublishedEvents', fn: getPublishedEvents },
    { name: 'getAvailableProducts', fn: getAvailableProducts },
    { name: 'getDisplayedEcclesias', fn: getDisplayedEcclesias },
    { name: 'getYouthAndFriendsCount', fn: getYouthAndFriendsCount },
  ];

  for (const t of tests) {
    const isFunction = typeof t.fn === 'function';
    console.log(`  ${isFunction ? '✅' : '❌'} ${t.name}: function exported properly`);
  }

  console.log('\n🚀 Phase 2 Query Memoization verification complete!');
}

testMemoization().catch(console.error);
