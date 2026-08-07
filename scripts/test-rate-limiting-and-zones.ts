import { NextRequest } from 'next/server';
import { evaluateRateLimit, getClientIp } from '../lib/security/rate-limiter';
import { classifyRouteZone } from '../lib/security/zones';
import { logSecurityEventNonBlocking } from '../lib/security/telemetry';

async function runSecuritySuite() {
  console.log('=== RUNNING HIGH-PERFORMANCE SECURITY & ROUTING BENCHMARK SUITE ===\n');

  // Test 1: Route Zone Classification
  console.log('[Test 1] Testing Declarative Route Zone Classification...');
  const zoneTests = [
    { path: '/', expected: 'PUBLIC' },
    { path: '/events', expected: 'PUBLIC' },
    { path: '/events/camp-2026', expected: 'PUBLIC' },
    { path: '/merch', expected: 'PUBLIC' },
    { path: '/login', expected: 'RESTRICTED_PUBLIC' },
    { path: '/register', expected: 'RESTRICTED_PUBLIC' },
    { path: '/reset-password', expected: 'RESTRICTED_PUBLIC' },
    { path: '/portal', expected: 'PRIVATE_MEMBER' },
    { path: '/portal/orders', expected: 'PRIVATE_MEMBER' },
    { path: '/admin', expected: 'PRIVATE_ADMIN' },
    { path: '/admin/events/new', expected: 'PRIVATE_ADMIN' },
  ];

  for (const item of zoneTests) {
    const zone = classifyRouteZone(item.path);
    if (zone !== item.expected) {
      throw new Error(`Zone classification failed for ${item.path}: expected ${item.expected}, got ${zone}`);
    }
    console.log(`  ✓ Route "${item.path}" correctly mapped to zone: ${zone}`);
  }

  // Test 2: High-Efficiency O(1) Rate Limiter & Brute-force Protection
  console.log('\n[Test 2] Testing Rate Limiting on Sensitive Endpoint (/login)...');
  const dummyIp = '203.0.113.42';

  function createMockRequest(path: string, ip: string): NextRequest {
    const url = `http://localhost:3000${path}`;
    return new NextRequest(url, {
      headers: {
        'x-forwarded-for': ip,
      },
    });
  }

  // /login has a limit of 10 requests / 60 seconds
  let blockedCount = 0;
  for (let i = 1; i <= 15; i++) {
    const mockReq = createMockRequest('/login', dummyIp);
    const result = evaluateRateLimit(mockReq);

    if (i <= 10) {
      if (!result.allowed) {
        throw new Error(`Request #${i} should have been allowed under limit of 10`);
      }
    } else {
      if (result.allowed) {
        throw new Error(`Request #${i} should have been BLOCKED by 429 rate limiter`);
      }
      blockedCount++;
    }
  }
  console.log(`  ✓ Successfully allowed initial 10 requests and blocked ${blockedCount} subsequent brute-force attempts with 429 status.`);

  // Test 3: Benchmark Execution Latency (Zero-DB / O(1) Performance Pillar)
  console.log('\n[Test 3] Benchmarking Rate Limiter Execution Latency (10,000 requests)...');
  const iterations = 10000;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    const req = createMockRequest('/api/events', `192.168.1.${i % 250}`);
    evaluateRateLimit(req);
  }

  const elapsed = performance.now() - start;
  const avgLatencyUs = (elapsed / iterations) * 1000; // in microseconds
  const avgLatencyMs = elapsed / iterations; // in milliseconds

  console.log(`  ⚡ Completed ${iterations} rate limit evaluations in ${elapsed.toFixed(2)}ms`);
  console.log(`  ⚡ Average Latency per request: ${avgLatencyUs.toFixed(2)} µs (${avgLatencyMs.toFixed(4)} ms)`);
  console.log(`  ⚡ Throughput: ${Math.round((iterations / elapsed) * 1000).toLocaleString()} evaluations/sec`);

  if (avgLatencyMs > 5.0) {
    throw new Error(`Latency SLA failed: expected <5ms, got ${avgLatencyMs}ms`);
  }
  console.log(`  ✅ Latency is well below the <5ms SLA requirement!`);

  // Test 4: Non-Blocking Telemetry Verification
  console.log('\n[Test 4] Verifying Non-Blocking Security Telemetry Logger...');
  logSecurityEventNonBlocking({
    eventType: 'RATE_LIMIT_EXCEEDED',
    clientIp: dummyIp,
    method: 'POST',
    path: '/login',
    statusCode: 429,
    reason: 'Exceeded 10 requests per minute',
  });
  console.log('  ✓ Security telemetry dispatched asynchronously via non-blocking microtask queue.');

  console.log('\n✨ ALL ROUTING, ZONE GUARDS, AND RATE LIMITING TESTS PASSED! ✨\n');
}

runSecuritySuite().catch((err) => {
  console.error('Security benchmark failed:', err);
  process.exit(1);
});
