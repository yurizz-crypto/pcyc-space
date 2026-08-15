import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/db/queries/users';
import { getAllEcclesias } from '@/lib/db/queries/ecclesias';
import { CreateUserForm } from './create-user-form';
import { ArrowLeft, UserPlus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Provision Member / Admin Account | PCYC Admin',
  description: 'Add a new member or administrator to the PCYC platform.',
};

export default async function AdminNewUserPage() {
  const currentAdmin = await getCurrentUserProfile();
  if (!currentAdmin || (currentAdmin.role !== 'ADMIN' && currentAdmin.role !== 'SUPERADMIN')) {
    redirect('/portal');
  }

  const ecclesias = await getAllEcclesias();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#e0a861] hover:text-[#f0be7c] transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to User Directory</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1] flex items-center gap-2">
            <UserPlus className="h-7 w-7 text-[#e0a861]" />
            <span>Provision Member Account</span>
          </h1>
          <p className="text-sm text-[#707666] dark:text-[#a3ab98] mt-1">
            Create an official membership account with Ecclesia affiliation and role designation.
          </p>
        </div>
      </div>

      <CreateUserForm
        ecclesiasList={ecclesias}
        isSuperAdmin={currentAdmin.role === 'SUPERADMIN'}
      />
    </div>
  );
}
