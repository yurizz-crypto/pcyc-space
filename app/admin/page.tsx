import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getAllEvents } from '@/lib/db/queries/events';
import { getAllProducts } from '@/lib/db/queries/products';
import { getAllOrdersWithReceipts } from '@/lib/db/queries/orders';
import { getAllMembers } from '@/lib/db/queries/users';
import { getAllEcclesias } from '@/lib/db/queries/ecclesias';
import { getYouthAndFriendsCount } from '@/lib/db/queries/settings';
import { updateYouthCountAction } from '@/app/actions/settings';
import { Calendar, ShoppingBag, Receipt, Users, Plus, Church, Sparkles, SlidersHorizontal } from 'lucide-react';

export default async function AdminDashboardPage() {
  const [eventsList, productsList, ordersList, membersList, ecclesiasList, youthCount] =
    await Promise.all([
      getAllEvents(),
      getAllProducts(),
      getAllOrdersWithReceipts(),
      getAllMembers(),
      getAllEcclesias(),
      getYouthAndFriendsCount(),
    ]);

  const pendingOrders = ordersList.filter(
    (o) => o.status === 'PENDING_PAYMENT' || (o.receipt && o.receipt.verificationStatus === 'PENDING')
  );

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2c3324] dark:text-[#fefcf1]">
            Administration Overview
          </h1>
          <p className="text-sm text-[#707666] dark:text-[#a3ab98]">
            Manage live events, merchandise inventory, ecclesia directory, and platform metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/events/new">
            <Button variant="primary" size="md" className="gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </Button>
          </Link>
          <Link href="/admin/merch/new">
            <Button variant="outline" size="md" className="gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>Add Merch</span>
            </Button>
          </Link>
          <Link href="/admin/ecclesias/new">
            <Button variant="outline" size="md" className="gap-2 shadow-xs bg-white dark:bg-[#1b2117]">
              <Plus className="h-4 w-4" />
              <span>Add Ecclesia</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-[#707666] dark:text-[#a3ab98] uppercase tracking-wider">
              Ecclesias
            </span>
            <Church className="h-4 w-4 text-[#e0a861]" />
          </CardHeader>
          <CardContent>
            <div className="font-serif font-bold text-3xl text-[#2c3324] dark:text-[#fefcf1]">
              {ecclesiasList.length}
            </div>
            <p className="text-[11px] text-[#707666] dark:text-[#a3ab98] mt-1">Active fellowships in PH</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-[#707666] dark:text-[#a3ab98] uppercase tracking-wider">
              Events
            </span>
            <Calendar className="h-4 w-4 text-[#e0a861]" />
          </CardHeader>
          <CardContent>
            <div className="font-serif font-bold text-3xl text-[#2c3324] dark:text-[#fefcf1]">
              {eventsList.length}
            </div>
            <p className="text-[11px] text-[#707666] dark:text-[#a3ab98] mt-1">Live camps in database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-[#707666] dark:text-[#a3ab98] uppercase tracking-wider">
              Merchandise
            </span>
            <ShoppingBag className="h-4 w-4 text-[#e0a861]" />
          </CardHeader>
          <CardContent>
            <div className="font-serif font-bold text-3xl text-[#2c3324] dark:text-[#fefcf1]">
              {productsList.length}
            </div>
            <p className="text-[11px] text-[#707666] dark:text-[#a3ab98] mt-1">Active store catalog items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-[#707666] dark:text-[#a3ab98] uppercase tracking-wider">
              Pending Receipts
            </span>
            <Receipt className="h-4 w-4 text-[#ca914a]" />
          </CardHeader>
          <CardContent>
            <div className="font-serif font-bold text-3xl text-[#9a6423] dark:text-[#f0be7c]">
              {pendingOrders.length}
            </div>
            <p className="text-[11px] text-[#707666] dark:text-[#a3ab98] mt-1">GCash receipts queue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-semibold text-[#707666] dark:text-[#a3ab98] uppercase tracking-wider">
              Members
            </span>
            <Users className="h-4 w-4 text-[#2e7d32]" />
          </CardHeader>
          <CardContent>
            <div className="font-serif font-bold text-3xl text-[#2c3324] dark:text-[#fefcf1]">
              {membersList.length}
            </div>
            <p className="text-[11px] text-[#707666] dark:text-[#a3ab98] mt-1">Registered Brethren</p>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Site Metric Setting: Youth & Friends */}
      <Card className="border-[#e0a861]/50 bg-gradient-to-r from-[#fefcf1] to-[#f8f4e3] dark:from-[#1d2419] dark:to-[#161c13] dark:border-[#e0a861]/30">
        <CardHeader>
          <div className="flex items-center gap-2 text-[#9a6423] dark:text-[#f0be7c]">
            <SlidersHorizontal className="h-5 w-5" />
            <CardTitle className="text-lg font-serif">Platform Metric: Youth & Friends Count</CardTitle>
          </div>
          <CardDescription>
            Configure the live counter displayed in the Home page Hero banner (e.g. {youthCount}+). Must be at least 1.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateYouthCountAction} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
            <div className="flex-1">
              <Input
                name="count"
                type="number"
                min="1"
                defaultValue={youthCount}
                required
                className="bg-white dark:bg-[#131710] font-mono font-bold text-base"
              />
            </div>
            <Button type="submit" variant="primary" size="md" className="gap-2 shadow-xs">
              <Sparkles className="h-4 w-4" />
              <span>Update Counter</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Section: Ecclesias Directory & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ecclesias Directory Snippet */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl">Philippine Ecclesia Directory</CardTitle>
              <CardDescription>Fellowship locations in database ({ecclesiasList.length} total).</CardDescription>
            </div>
            <Link href="/admin/ecclesias" className="text-xs font-semibold text-[#9a6423] dark:text-[#f0be7c] hover:underline">
              Manage All &rarr;
            </Link>
          </CardHeader>
          <CardContent>
            {ecclesiasList.length === 0 ? (
              <p className="text-xs text-[#707666] dark:text-[#a3ab98]">No ecclesias registered yet.</p>
            ) : (
              <div className="space-y-3">
                {ecclesiasList.slice(0, 4).map((ecc) => (
                  <div
                    key={ecc.id}
                    className="p-3.5 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#2c3324] dark:text-[#fefcf1] truncate">{ecc.name}</p>
                      <p className="text-[11px] text-[#707666] dark:text-[#a3ab98] truncate">{ecc.city}, {ecc.region}</p>
                    </div>
                    <Badge variant={ecc.region === 'Luzon' ? 'gold' : ecc.region === 'Visayas' ? 'cream' : 'forest'} size="sm">
                      {ecc.region}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events CMS Table Snippet */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl">PCYC Events & Gatherings</CardTitle>
              <CardDescription>Live database events published on the site.</CardDescription>
            </div>
            <Link href="/admin/events" className="text-xs font-semibold text-[#9a6423] dark:text-[#f0be7c] hover:underline">
              View All &rarr;
            </Link>
          </CardHeader>
          <CardContent>
            {eventsList.length === 0 ? (
              <p className="text-xs text-[#707666] dark:text-[#a3ab98]">No events created yet.</p>
            ) : (
              <div className="space-y-3">
                {eventsList.slice(0, 4).map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#2c3324] dark:text-[#fefcf1] truncate">{evt.title}</p>
                      <p className="text-[11px] text-[#707666] dark:text-[#a3ab98] truncate">{evt.location}</p>
                    </div>
                    <Badge variant={evt.isPublished ? 'success' : 'cream'} size="sm">
                      {evt.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
