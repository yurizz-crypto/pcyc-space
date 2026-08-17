'use client';

import React, { useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminUpdateUserAction, type AdminUserActionResult } from '@/app/actions/admin-users';
import type { Profile, UserDesignation } from '@/lib/db/schema/users';
import type { Ecclesia } from '@/lib/db/schema/ecclesias';
import { Sparkles, AlertCircle } from 'lucide-react';

interface EditUserFormProps {
  user: Profile;
  ecclesiasList: Ecclesia[];
  isSuperAdmin: boolean;
}

const initialState: AdminUserActionResult = {
  success: false,
};

export function EditUserForm({ user, ecclesiasList }: EditUserFormProps) {
  const router = useRouter();
  const [designation, setDesignation] = useState<UserDesignation>(user.designation);

  const [state, formAction, isPending] = useActionState(
    async (prev: AdminUserActionResult, formData: FormData) => {
      const result = await adminUpdateUserAction(prev, formData);
      if (result.success) {
        router.refresh();
      }
      return result;
    },
    initialState
  );

  return (
    <Card className="bg-white dark:bg-[#1b2117] border-[#e6dfcb] dark:border-[#323d2b]">
      <CardHeader>
        <CardTitle className="text-xl">Edit Member Information</CardTitle>
        <CardDescription>
          Update ecclesia affiliation, designation, and contact information.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to update member</p>
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

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="userId" value={user.id} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="firstName"
                type="text"
                defaultValue={user.firstName}
                required
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
                defaultValue={user.middleName || ''}
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
                defaultValue={user.lastName}
                required
                className="h-10"
              />
              {state.fieldErrors?.lastName && (
                <p className="text-[11px] text-red-500 mt-1">{state.fieldErrors.lastName[0]}</p>
              )}
            </div>
          </div>

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
                <option value="FRIEND">Friend (Interested Visitor)</option>
                <option value="BROTHER">Brother (Baptized)</option>
                <option value="SISTER">Sister (Baptized)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                Baptism Date {designation !== 'FRIEND' && <span className="text-red-500">*</span>}
              </label>
              <Input
                name="baptismDate"
                type="date"
                defaultValue={user.baptismDate || ''}
                required={designation === 'BROTHER' || designation === 'SISTER'}
                className="h-10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                Ecclesia Affiliation
              </label>
              <select
                name="ecclesia"
                defaultValue={user.ecclesia || ''}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                Phone Number
              </label>
              <Input
                name="phoneNumber"
                type="tel"
                defaultValue={user.phoneNumber || ''}
                placeholder="+63 917 123 4567"
                className="h-10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                Email Address (Managed via Auth)
              </label>
              <Input
                type="email"
                value={user.email}
                disabled
                className="h-10 bg-gray-100 dark:bg-gray-800 text-[#707666] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#e6dfcb] dark:border-[#323d2b]">
            <Button type="submit" variant="primary" size="md" disabled={isPending}>
              {isPending ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
