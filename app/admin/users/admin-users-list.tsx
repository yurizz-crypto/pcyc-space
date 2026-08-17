'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Pagination } from '@/components/ui/pagination';
import { maskEmail, maskPhoneNumber } from '@/lib/security/privacy';
import {
  adminChangeUserRoleAction,
  adminToggleUserStatusAction,
  adminAnonymizeUserAction,
  adminLogPiiRevealAction,
} from '@/app/actions/admin-users';
import type { Profile, UserRole, UserStatus } from '@/lib/db/schema/users';
import type { Ecclesia } from '@/lib/db/schema/ecclesias';
import {
  Search,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  UserMinus,
  Edit,
  Building,
  Calendar,
  Phone,
  Mail,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AdminUsersListProps {
  initialUsers: Profile[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  ecclesiasList: Ecclesia[];
  currentAdminRole: UserRole;
  currentAdminId: string;
}

export function AdminUsersList({
  initialUsers,
  totalCount,
  currentPage,
  pageSize,
  totalPages,
  ecclesiasList,
  currentAdminRole,
  currentAdminId,
}: AdminUsersListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || 'ALL');
  const [selectedDesignation, setSelectedDesignation] = useState(searchParams.get('designation') || 'ALL');
  const [selectedEcclesia, setSelectedEcclesia] = useState(searchParams.get('ecclesia') || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'ALL');

  // PII Reveal State (Map of userId -> boolean)
  const [revealedUsers, setRevealedUsers] = useState<Record<string, boolean>>({});

  // Role Modification Modal State
  const [roleModalUser, setRoleModalUser] = useState<Profile | null>(null);
  const [newRoleTarget, setNewRoleTarget] = useState<UserRole>('MEMBER');
  const [roleActionMessage, setRoleActionMessage] = useState<string | null>(null);
  const [roleActionError, setRoleActionError] = useState<string | null>(null);

  // Status Modal State
  const [statusModalUser, setStatusModalUser] = useState<Profile | null>(null);
  const [newStatusTarget, setNewStatusTarget] = useState<UserStatus>('SUSPENDED');

  // Anonymization Modal State
  const [anonymizeModalUser, setAnonymizeModalUser] = useState<Profile | null>(null);
  const [confirmAnonymizeText, setConfirmAnonymizeText] = useState('');

  // Handle URL Param Sync
  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'ALL') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to page 1
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilter('search', searchQuery.trim());
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`);
    });
  };

  const togglePiiReveal = (userId: string) => {
    const currentlyRevealed = !!revealedUsers[userId];
    if (!currentlyRevealed) {
      // Admin is revealing PII -> Record in audit trail non-blocking
      adminLogPiiRevealAction(userId);
    }
    setRevealedUsers((prev) => ({
      ...prev,
      [userId]: !currentlyRevealed,
    }));
  };

  const handleRoleChangeSubmit = async () => {
    if (!roleModalUser) return;
    setRoleActionError(null);
    setRoleActionMessage(null);

    const formData = new FormData();
    formData.set('userId', roleModalUser.id);
    formData.set('role', newRoleTarget);

    const result = await adminChangeUserRoleAction({ success: false }, formData);
    if (result.success) {
      setRoleActionMessage(result.message || 'Role updated successfully!');
      setTimeout(() => {
        setRoleModalUser(null);
        setRoleActionMessage(null);
        router.refresh();
      }, 1200);
    } else {
      setRoleActionError(result.error || 'Failed to update role.');
    }
  };

  const handleStatusChangeSubmit = async () => {
    if (!statusModalUser) return;
    const formData = new FormData();
    formData.set('userId', statusModalUser.id);
    formData.set('status', newStatusTarget);

    const result = await adminToggleUserStatusAction({ success: false }, formData);
    if (result.success) {
      setStatusModalUser(null);
      router.refresh();
    } else {
      alert(result.error || 'Failed to change status.');
    }
  };

  const handleAnonymizeSubmit = async () => {
    if (!anonymizeModalUser) return;
    if (confirmAnonymizeText !== anonymizeModalUser.email) {
      alert('Email confirmation does not match.');
      return;
    }

    const formData = new FormData();
    formData.set('userId', anonymizeModalUser.id);

    const result = await adminAnonymizeUserAction(formData);
    if (result.success) {
      setAnonymizeModalUser(null);
      setConfirmAnonymizeText('');
      router.refresh();
    } else {
      alert(result.error || 'Failed to anonymize user.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <Card className="bg-white dark:bg-[#1b2117] border-[#e6dfcb] dark:border-[#323d2b]">
        <CardContent className="p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a9180]" />
              <Input
                type="text"
                placeholder="Search member name, email, or Ecclesia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-[#f8f4e3]/60 dark:bg-[#131710] border-[#e6dfcb] dark:border-[#323d2b]"
              />
            </div>
            <Button type="submit" variant="primary" size="md" disabled={isPending}>
              <span>Search</span>
            </Button>
            {(searchQuery || selectedRole !== 'ALL' || selectedDesignation !== 'ALL' || selectedEcclesia !== 'ALL' || selectedStatus !== 'ALL') && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('ALL');
                  setSelectedDesignation('ALL');
                  setSelectedEcclesia('ALL');
                  setSelectedStatus('ALL');
                  router.push('/admin/users');
                }}
              >
                <span>Reset Filters</span>
              </Button>
            )}
          </form>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#e6dfcb]/60 dark:border-[#323d2b]/60 text-xs">
            {/* Role Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-[#707666] dark:text-[#a3ab98] mb-1">
                Role Filter
              </label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  applyFilter('role', e.target.value);
                }}
                className="w-full h-8 px-2.5 rounded-lg bg-[#f8f4e3]/70 dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1]"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPERADMIN">Superadmin</option>
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
              </select>
            </div>

            {/* Designation Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-[#707666] dark:text-[#a3ab98] mb-1">
                Designation
              </label>
              <select
                value={selectedDesignation}
                onChange={(e) => {
                  setSelectedDesignation(e.target.value);
                  applyFilter('designation', e.target.value);
                }}
                className="w-full h-8 px-2.5 rounded-lg bg-[#f8f4e3]/70 dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1]"
              >
                <option value="ALL">All Designations</option>
                <option value="BROTHER">Brother</option>
                <option value="SISTER">Sister</option>
                <option value="FRIEND">Friend</option>
              </select>
            </div>

            {/* Ecclesia Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-[#707666] dark:text-[#a3ab98] mb-1">
                Ecclesia
              </label>
              <select
                value={selectedEcclesia}
                onChange={(e) => {
                  setSelectedEcclesia(e.target.value);
                  applyFilter('ecclesia', e.target.value);
                }}
                className="w-full h-8 px-2.5 rounded-lg bg-[#f8f4e3]/70 dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1]"
              >
                <option value="ALL">All Ecclesias</option>
                {ecclesiasList.map((ecc) => (
                  <option key={ecc.id} value={ecc.name}>
                    {ecc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-[#707666] dark:text-[#a3ab98] mb-1">
                Account Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  applyFilter('status', e.target.value);
                }}
                className="w-full h-8 px-2.5 rounded-lg bg-[#f8f4e3]/70 dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="ANONYMIZED">Anonymized</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Directory Table */}
      <Card className="overflow-hidden bg-white dark:bg-[#1b2117] border-[#e6dfcb] dark:border-[#323d2b]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#f8f4e3] dark:bg-[#161c12] border-b border-[#e6dfcb] dark:border-[#323d2b] text-[#707666] dark:text-[#a3ab98] font-semibold">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Ecclesia</th>
                <th className="py-3 px-4">Contact & PII</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfcb]/60 dark:divide-[#323d2b]/60">
              {initialUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#707666] dark:text-[#a3ab98]">
                    No members match the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                initialUsers.map((user) => {
                  const isRevealed = !!revealedUsers[user.id];
                  const displayedEmail = isRevealed ? user.email : maskEmail(user.email);
                  const displayedPhone = isRevealed
                    ? user.phoneNumber || 'N/A'
                    : maskPhoneNumber(user.phoneNumber);

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[#f8f4e3]/40 dark:hover:bg-[#20271b] transition-colors"
                    >
                      {/* Name & Joined Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#2c3324] dark:text-[#fefcf1]">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="hover:text-[#e0a861] transition-colors"
                          >
                            {user.firstName} {user.middleName ? `${user.middleName} ` : ''}
                            {user.lastName}
                          </Link>
                        </div>
                        <div className="text-[11px] text-[#8a9180] flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Designation */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            user.designation === 'BROTHER'
                              ? 'forest'
                              : user.designation === 'SISTER'
                              ? 'gold'
                              : 'cream'
                          }
                          size="sm"
                        >
                          {user.designation}
                        </Badge>
                        {user.baptismDate && (
                          <div className="text-[10px] text-[#8a9180] mt-0.5">
                            Baptized: {user.baptismDate}
                          </div>
                        )}
                      </td>

                      {/* Ecclesia */}
                      <td className="py-3.5 px-4 text-[#505748] dark:text-[#a3ab98]">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Building className="h-3.5 w-3.5 text-[#e0a861]" />
                          <span>{user.ecclesia || 'Independent'}</span>
                        </div>
                      </td>

                      {/* Masked PII Contact with Reveal Action */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-[#2c3324] dark:text-[#fefcf1]">
                            <Mail className="h-3 w-3 text-[#8a9180]" />
                            <span className="font-mono text-[11px]">{displayedEmail}</span>
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center gap-1.5 text-xs text-[#505748] dark:text-[#a3ab98]">
                              <Phone className="h-3 w-3 text-[#8a9180]" />
                              <span className="font-mono text-[11px]">{displayedPhone}</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => togglePiiReveal(user.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#9a6423] dark:text-[#f0be7c] hover:underline"
                            title={isRevealed ? 'Hide details' : 'Reveal details (Audited)'}
                          >
                            {isRevealed ? (
                              <>
                                <EyeOff className="h-3 w-3" />
                                <span>Mask</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3" />
                                <span>Reveal</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            user.role === 'SUPERADMIN'
                              ? 'gold'
                              : user.role === 'ADMIN'
                              ? 'forest'
                              : 'cream'
                          }
                          size="sm"
                        >
                          {user.role}
                        </Badge>
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            user.status === 'ACTIVE'
                              ? 'success'
                              : user.status === 'SUSPENDED'
                              ? 'destructive'
                              : 'cream'
                          }
                          size="sm"
                        >
                          {user.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/users/${user.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              title="View full profile & audit trail"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              <span>Details</span>
                            </Button>
                          </Link>

                          {/* Superadmin Role Change Button */}
                          {currentAdminRole === 'SUPERADMIN' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs border-[#e0a861]/50 text-[#9a6423] dark:text-[#f0be7c]"
                              onClick={() => {
                                setRoleModalUser(user);
                                setNewRoleTarget(user.role);
                              }}
                              title="Change user privileges"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              <span>Role</span>
                            </Button>
                          )}

                          {/* Suspend / Activate Toggle */}
                          {user.id !== currentAdminId && user.role !== 'SUPERADMIN' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className={`h-7 px-2 text-xs ${
                                user.status === 'ACTIVE'
                                  ? 'text-[#c62828] hover:bg-[#c62828]/10'
                                  : 'text-[#2e7d32] hover:bg-[#2e7d32]/10'
                              }`}
                              onClick={() => {
                                setStatusModalUser(user);
                                setNewStatusTarget(user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
                              }}
                              title={user.status === 'ACTIVE' ? 'Suspend user' : 'Reactivate user'}
                            >
                              {user.status === 'ACTIVE' ? (
                                <UserX className="h-3 w-3" />
                              ) : (
                                <UserCheck className="h-3 w-3" />
                              )}
                            </Button>
                          )}

                          {/* Right to Erasure / Anonymize Modal (Superadmin only) */}
                          {currentAdminRole === 'SUPERADMIN' &&
                            user.id !== currentAdminId &&
                            user.status !== 'ANONYMIZED' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs text-[#8a9180] hover:text-[#c62828]"
                                onClick={() => {
                                  setAnonymizeModalUser(user);
                                  setConfirmAnonymizeText('');
                                }}
                                title="Right to Erasure (Anonymize account data)"
                              >
                                <UserMinus className="h-3 w-3" />
                              </Button>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Server Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Card>

      {/* Role Management Modal */}
      {roleModalUser && (
        <Modal
          isOpen={!!roleModalUser}
          onClose={() => {
            setRoleModalUser(null);
            setRoleActionError(null);
            setRoleActionMessage(null);
          }}
          title="Modify Account Privileges"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#707666] dark:text-[#a3ab98]">
              Elevating or demoting a user modifies their access to administrative workflows and member records.
            </p>

            <div className="p-3 bg-[#f8f4e3] dark:bg-[#131710] rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] space-y-1 text-xs">
              <div>
                <strong>Member:</strong> {roleModalUser.firstName} {roleModalUser.lastName}
              </div>
              <div>
                <strong>Email:</strong> {maskEmail(roleModalUser.email)}
              </div>
              <div>
                <strong>Current Role:</strong> <Badge size="sm">{roleModalUser.role}</Badge>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1.5">
                Designate New Role
              </label>
              <select
                value={newRoleTarget}
                onChange={(e) => setNewRoleTarget(e.target.value as UserRole)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#131710] border border-[#e6dfcb] dark:border-[#323d2b] text-sm font-semibold"
              >
                <option value="MEMBER">MEMBER (Standard Brethren access)</option>
                <option value="ADMIN">ADMIN (Events, Merchandise, and Orders management)</option>
                <option value="SUPERADMIN">SUPERADMIN (Full platform command and role delegation)</option>
              </select>
            </div>

            {roleActionError && (
              <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{roleActionError}</span>
              </div>
            )}

            {roleActionMessage && (
              <div className="p-2.5 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{roleActionMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setRoleModalUser(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleRoleChangeSubmit}
                disabled={newRoleTarget === roleModalUser.role}
              >
                Confirm Role Change
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Account Status Modal */}
      {statusModalUser && (
        <Modal
          isOpen={!!statusModalUser}
          onClose={() => setStatusModalUser(null)}
          title={newStatusTarget === 'SUSPENDED' ? 'Suspend Member Account' : 'Reactivate Member Account'}
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#707666] dark:text-[#a3ab98]">
              {newStatusTarget === 'SUSPENDED'
                ? `Suspending ${statusModalUser.firstName} ${statusModalUser.lastName} will immediately block them from logging in, registering for camps, or placing merch orders.`
                : `Reactivating ${statusModalUser.firstName} ${statusModalUser.lastName} will restore their login privileges.`}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStatusModalUser(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={newStatusTarget === 'SUSPENDED' ? 'destructive' : 'primary'}
                size="md"
                onClick={handleStatusChangeSubmit}
              >
                Confirm {newStatusTarget === 'SUSPENDED' ? 'Suspension' : 'Reactivation'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Anonymize / Right to Erasure Modal */}
      {anonymizeModalUser && (
        <Modal
          isOpen={!!anonymizeModalUser}
          onClose={() => {
            setAnonymizeModalUser(null);
            setConfirmAnonymizeText('');
          }}
          title="Right to Erasure / Anonymize Account"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 rounded-xl text-red-800 dark:text-red-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                <span>Irreversible Privacy Action</span>
              </div>
              <p>
                This action scrubs all personally identifiable information (name, phone, baptism date, email) and deletes the authentication account.
                Financial transaction references are retained anonymously for bookkeeping integrity.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] mb-1">
                Type <span className="font-mono text-red-600">{anonymizeModalUser.email}</span> to confirm:
              </label>
              <Input
                type="text"
                value={confirmAnonymizeText}
                onChange={(e) => setConfirmAnonymizeText(e.target.value)}
                placeholder="Enter member email..."
                className="h-10"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setAnonymizeModalUser(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="md"
                onClick={handleAnonymizeSubmit}
                disabled={confirmAnonymizeText !== anonymizeModalUser.email}
              >
                Permanently Anonymize
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
