'use client';

import React, { useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { adminCreateUserAction, type AdminUserActionResult } from '@/app/actions/admin-users';
import type { Ecclesia } from '@/lib/db/schema/ecclesias';
import type { UserRole, UserDesignation } from '@/lib/db/schema/users';
import { Sparkles, Shield, User, Mail, Phone, Calendar, Church, AlertCircle } from 'lucide-react';

interface CreateUserFormProps {
  ecclesiasList: Ecclesia[];
  isSuperAdmin: boolean;
}

const initialState: AdminUserActionResult = {
  success: false,
};

export function CreateUserForm({ ecclesiasList, isSuperAdmin }: CreateUserFormProps) {
  const router = useRouter();
  const [designation, setDesignation] = useState<UserDesignation>('FRIEND');
  const [role, setRole] = useState<UserRole>('MEMBER');

  const [state, formAction, isPending] = useActionState(
    async (prev: AdminUserActionResult, formData: FormData) => {
      const result = await adminCreateUserAction(prev, formData);
      if (result.success) {
        setTimeout(() => {
          router.push('/admin/users');
        }, 1500);
      }
      return result;
    },
    initialState
  );

  return (
    <Card className="bg-white dark:bg-[#1b2117] border-[#e6dfcb] dark:border-[#323d2b] shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Member Registration Form</CardTitle>
        <CardDescription>
          Personal information is handled under strict data privacy regulations.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to create member account</p>
              <p className="text-xs mt-0.5">{state.error}</p>
            </div>
          </div>
        )}

        {state.success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-300 text-sm flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="font-semibold">{state.message}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {/* Identity Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#707666] dark:text-[#a3ab98] border-b border-[#e6dfcb] dark:border-[#323d2b] pb-1">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="firstName"
                  type="text"
                  required
                  placeholder="e.g. Samuel"
                  className="h-10"
                />
                {state.fieldErrors?.firstName && (
                  <p className="text-[11px] text-red-500 mt-1">{state.fieldErrors.firstName[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                  Middle Name
                </label>
                <Input
                  name="middleName"
                  type="text"
                  placeholder="Optional"
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="lastName"
                  type="text"
                  required
                  placeholder="e.g. Santos"
                  className="h-10"
                />
                {state.fieldErrors?.lastName && (
                  <p className="text-[11px] text-red-500 mt-1">{state.fieldErrors.lastName[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Fellowship & Faith Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#707666] dark:text-[#a3ab98] border-b border-[#e6dfcb] dark:border-[#323d2b] pb-1">
              Ecclesial Fellowship & Baptism
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                <select
                  name="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value as UserDesignation)}
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] text-sm font-medium"
                >
                  <option value="FRIEND">Friend (Interested Visitor / Inquirer)</option>
                  <option value="BROTHER">Brother (Baptized Christadelphian)</option>
                  <option value="SISTER">Sister (Baptized Christadelphian)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                  Baptism Date {designation !== 'FRIEND' && <span className="text-red-500">*</span>}
                </label>
                <Input
                  name="baptismDate"
                  type="date"
                  required={designation === 'BROTHER' || designation === 'SISTER'}
                  className="h-10"
                />
                {state.fieldErrors?.baptismDate && (
                  <p className="text-[11px] text-red-500 mt-1">{state.fieldErrors.baptismDate[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                  Ecclesia Affiliation
                </label>
                <select
                  name="ecclesia"
                  className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] text-sm font-medium"
                >
                  <option value="">Independent / Not Listed</option>
                  {ecclesiasList.map((ecc) => (
                    <option key={ecc.id} value={ecc.name}>
                      {ecc.name} ({ecc.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact & Credentials Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#707666] dark:text-[#a3ab98] border-b border-[#e6dfcb] dark:border-[#323d2b] pb-1">
              Account Credentials & Security
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="member@example.com"
                  className="h-10"
                />
                {state.fieldErrors?.email && (
                  <p className="text-[11px] text-red-500 mt-1">{state.fieldErrors.email[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                  Phone Number
                </label>
                <Input
                  name="phoneNumber"
                  type="tel"
                  placeholder="+63 917 123 4567"
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                  Initial Password <span className="text-red-500">*</span>
                </label>
                <PasswordInput
                  name="password"
                  required
                  placeholder="Minimum 6 characters"
                  className="h-10"
                />
                {state.fieldErrors?.password && (
                  <p className="text-[11px] text-red-500 mt-1">{state.fieldErrors.password[0]}</p>
                )}
              </div>

              {isSuperAdmin && (
                <div>
                  <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                    System Access Privileges (Superadmin Only)
                  </label>
                  <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] text-sm font-semibold text-[#e0a861]"
                  >
                    <option value="MEMBER">MEMBER (Standard Brethren Access)</option>
                    <option value="ADMIN">ADMIN (Events & Store Management)</option>
                    <option value="SUPERADMIN">SUPERADMIN (Full Platform Authority)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e6dfcb] dark:border-[#323d2b]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => router.push('/admin/users')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isPending}>
              {isPending ? 'Provisioning Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
