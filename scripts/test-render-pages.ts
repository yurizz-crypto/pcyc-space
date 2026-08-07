import { getCurrentUserProfile } from '../lib/db/queries/users';
import { getAllEvents } from '../lib/db/queries/events';
import { getAllProducts } from '../lib/db/queries/products';
import { getAllOrdersWithReceipts, getUserOrders } from '../lib/db/queries/orders';
import { getAllMembers } from '../lib/db/queries/users';
import { getAllEcclesias } from '../lib/db/queries/ecclesias';
import { getYouthAndFriendsCount } from '../lib/db/queries/settings';

async function testRender() {
  console.log('Testing Admin & Portal DB Queries...');
  try {
    const events = await getAllEvents();
    console.log('Events count:', events.length);

    const products = await getAllProducts();
    console.log('Products count:', products.length);

    const orders = await getAllOrdersWithReceipts();
    console.log('Orders count:', orders.length);

    const members = await getAllMembers();
    console.log('Members count:', members.length);

    const ecclesias = await getAllEcclesias();
    console.log('Ecclesias count:', ecclesias.length);

    const count = await getYouthAndFriendsCount();
    console.log('Youth count:', count);

    console.log('✅ All queries succeeded!');
  } catch (err) {
    console.error('❌ Query execution failed:', err);
  }
}

testRender().catch(console.error);
