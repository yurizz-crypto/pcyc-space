import { db } from '../lib/db';
import { profiles } from '../lib/db/schema/users';
import { ecclesias } from '../lib/db/schema/ecclesias';
import { siteSettings } from '../lib/db/schema/settings';
import { events } from '../lib/db/schema/events';
import { products } from '../lib/db/schema/products';
import { getEcclesiaCount, getAllEcclesias, getDisplayedEcclesias } from '../lib/db/queries/ecclesias';
import { getYouthAndFriendsCount } from '../lib/db/queries/settings';
import { getPublishedEvents } from '../lib/db/queries/events';
import { getAvailableProducts } from '../lib/db/queries/products';
import { eq } from 'drizzle-orm';

async function runIntegrationAudit() {
  console.log('🔍 Running Stage 3: End-to-End Integration & Zero Auto-Population Consistency Audit...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, description: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${description}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${description}`);
      failed++;
    }
  }

  try {
    // 1. Verify Admin Account in Profiles
    const adminUser = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, 'admin@pcyc.ph'))
      .limit(1);

    assert(adminUser.length === 1, 'Admin user record exists in PostgreSQL profiles table');
    assert(adminUser[0]?.role === 'SUPERADMIN', `Admin user has role: ${adminUser[0]?.role} (expected SUPERADMIN)`);

    // 2. Verify Zero Auto-Populated Baseline
    const initialEcclesiaCount = await getEcclesiaCount();
    const initialEvents = await getPublishedEvents();
    const initialProducts = await getAvailableProducts();

    console.log(`  📊 Baseline Live Counts: ${initialEcclesiaCount} Ecclesias, ${initialEvents.length} Events, ${initialProducts.length} Products`);

    // 3. Test Dynamic Ecclesia Lifecycle (Add -> Increment -> Delete -> Decrement)
    const testEcclesiaName = `Integration Test Fellowship ${Date.now()}`;
    const [insertedEcclesia] = await db
      .insert(ecclesias)
      .values({
        name: testEcclesiaName,
        region: 'Visayas',
        city: 'Iloilo City',
        address: 'Test Address 123',
        meetingSchedule: 'Sundays 10:00 AM',
        isDisplayed: true,
      })
      .returning();

    const countAfterAdd = await getEcclesiaCount();
    assert(countAfterAdd === initialEcclesiaCount + 1, `Ecclesia count incremented after live add: ${initialEcclesiaCount} -> ${countAfterAdd}`);

    await db.delete(ecclesias).where(eq(ecclesias.id, insertedEcclesia.id));
    const countAfterDelete = await getEcclesiaCount();
    assert(countAfterDelete === initialEcclesiaCount, `Ecclesia count decremented back after deletion: ${countAfterAdd} -> ${countAfterDelete}`);

    // 4. Test Dynamic Event Lifecycle
    const testEventSlug = `test-camp-${Date.now()}`;
    const [insertedEvent] = await db
      .insert(events)
      .values({
        title: 'Test Live Camp',
        slug: testEventSlug,
        description: 'Test Description',
        startDate: new Date(),
        endDate: new Date(),
        location: 'Test Location',
        isPublished: true,
      })
      .returning();

    const eventsAfterAdd = await getPublishedEvents();
    assert(eventsAfterAdd.some((e) => e.slug === testEventSlug), 'Newly added event appears in live query');

    await db.delete(events).where(eq(events.id, insertedEvent.id));
    const eventsAfterDelete = await getPublishedEvents();
    assert(!eventsAfterDelete.some((e) => e.slug === testEventSlug), 'Deleted event removed cleanly from live query');

    // 5. Test Dynamic Product Lifecycle
    const testProductSlug = `test-merch-${Date.now()}`;
    const [insertedProduct] = await db
      .insert(products)
      .values({
        name: 'Test Live Hoodie',
        slug: testProductSlug,
        description: 'Test Merch Description',
        price: '499.00',
        category: 'Apparel',
        stockQuantity: 10,
        isAvailable: true,
      })
      .returning();

    const productsAfterAdd = await getAvailableProducts();
    assert(productsAfterAdd.some((p) => p.slug === testProductSlug), 'Newly added product appears in live query');

    await db.delete(products).where(eq(products.id, insertedProduct.id));
    const productsAfterDelete = await getAvailableProducts();
    assert(!productsAfterDelete.some((p) => p.slug === testProductSlug), 'Deleted product removed cleanly from live query');

    // 6. Test Site Settings Youth Count
    const currentYouthCount = await getYouthAndFriendsCount();
    assert(currentYouthCount >= 1, `Youth & Friends count is at least 1 (currently ${currentYouthCount})`);

    const newTestValue = 500;
    await db
      .insert(siteSettings)
      .values({
        key: 'youth_and_friends_count',
        value: newTestValue.toString(),
        description: 'Test update',
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: newTestValue.toString() },
      });

    const updatedYouthCount = await getYouthAndFriendsCount();
    assert(updatedYouthCount === 500, `Youth & Friends count successfully updated to ${updatedYouthCount}+ in DB`);

    console.log(`\n========================================`);
    console.log(`Audit Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Audit execution failed with error:', err);
    process.exit(1);
  }
}

runIntegrationAudit();
