/**
 * Unit Tests for Auth Credentials & Password Complexity
 * TDD Pillar: Validates password strength, email formatting, and sanitation before implementation.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { registerSchema, loginSchema } from '../lib/validators';

describe('Auth Password & Registration Validation Tests', () => {
  it('should validate strong password during user registration', () => {
    const validRegister = {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'juan.delacruz@gmail.com',
      password: 'PcycMember2026!',
      confirmPassword: 'PcycMember2026!',
      designation: 'FRIEND' as const,
      ecclesia: 'Manila',
      phoneNumber: '09171234567',
    };

    const result = registerSchema.safeParse(validRegister);
    assert.equal(result.success, true, 'Strong password with matching confirmation should pass');
  });

  it('should reject registration when passwords do not match', () => {
    const mismatchedRegister = {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'juan.delacruz@gmail.com',
      password: 'PcycMember2026!',
      confirmPassword: 'DifferentPassword123!',
      ecclesiaId: 'df2435e4-5d09-43fd-a306-429d579280a6',
    };

    const result = registerSchema.safeParse(mismatchedRegister);
    assert.equal(result.success, false, 'Mismatched passwords must fail validation');
  });

  it('should reject passwords shorter than 8 characters', () => {
    const shortPasswordRegister = {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'juan.delacruz@gmail.com',
      password: 'short',
      confirmPassword: 'short',
      ecclesiaId: 'df2435e4-5d09-43fd-a306-429d579280a6',
    };

    const result = registerSchema.safeParse(shortPasswordRegister);
    assert.equal(result.success, false, 'Short password must be rejected');
  });

  it('should validate login credentials', () => {
    const validLogin = {
      email: 'member@pcyc.ph',
      password: 'PcycMember2026!',
    };

    const result = loginSchema.safeParse(validLogin);
    assert.equal(result.success, true, 'Valid login credentials should pass');
  });
});
