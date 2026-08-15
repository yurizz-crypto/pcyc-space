import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile, getPaginatedUsersForAdmin } from '@/lib/db/queries/users';
import { getAllEcclesias } from '@/lib/db/queries/ecclesias';
import { AdminUsersList } from './admin-users-list';
import { Button } from '@/components/ui/button';
import { Plus, UserCheck, ShieldCheck, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'PCYC Member Directory & Access Control | Admin',
  description: 'Manage member roles, baptism verification, privacy controls, and admin privileges.',
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentAdmin = await getCurrentUserProfile();
  if (!currentAdmin || (currentAdmin.role !== 'ADMIN' && currentAdmin.role !== 'SUPERADMIN')) {
    redirect('/portal');
  }

  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) || 1 : 1;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;
  const role = typeof resolvedParams.role === 'string' ? resolvedParams.role : undefined;
  const designation = typeof resolvedParams.designation === 'string' ? resolvedParams.designation : undefined;
  const ecclesia = typeof resolvedParams.ecclesia === 'string' ? resolvedParams.ecclesia : undefined;
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status : undefined;

  const [usersData, ecclesiasList] = await Promise.all([
    getPaginatedUsersForAdmin({
      page,
      pageSize: 15,
      search,
      role,
      designation,
      ecclesia,
      status,
    }),
    getAllEcclesias(),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
              User Directory & Access Control
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#2e7d32]/15 text-[#2e7d32] border border-[#2e7d32]/30">
              <Lock className="h-3 w-3" />
              Privacy Shield Active
            </span>
          </div>
          <p className="text-sm text-[#707666] dark:text-[#a3ab98] mt-1">
            Manage church membership, role designations, Ecclesia affiliations, and account security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/users/new">
            <Button variant="primary" size="md" className="gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>Add Member / Admin</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Interactive User List */}
      <AdminUsersList
        initialUsers={usersData.users}
        totalCount={usersData.totalCount}
        currentPage={usersData.page}
        pageSize={usersData.pageSize}
        totalPages={usersData.totalPages}
        ecclesiasList={ecclesiasList}
        currentAdminRole={currentAdmin.role}
        currentAdminId={currentAdmin.id}
      />
    </div>
  );
}
