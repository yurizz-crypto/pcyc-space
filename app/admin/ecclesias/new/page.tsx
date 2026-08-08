'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { createEcclesiaAction } from '@/app/actions/ecclesias';
import { ArrowLeft, Church, Save } from 'lucide-react';

export default function NewEcclesiaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Navigation */}
      <div>
        <Link
          href="/admin/ecclesias"
          className="inline-flex items-center gap-1.5 text-xs text-[#707666] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Ecclesia Directory</span>
        </Link>
      </div>

      {/* Form Card */}
      <Card className="shadow-md">
        <form
          action={async (formData) => {
            setIsSubmitting(true);
            await createEcclesiaAction(formData);
            setIsSubmitting(false);
          }}
        >
          <CardHeader className="border-b border-[#e6dfcb] dark:border-[#323d2b] pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#e0a861]/15 text-[#9a6423] dark:text-[#f0be7c] flex items-center justify-center">
                <Church className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-serif">Add New Philippine Ecclesia</CardTitle>
                <CardDescription>
                  Register a fellowship location to appear across the directory, stats, and registration forms.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            {/* 1. Name & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ecclesia Name"
                name="name"
                placeholder="e.g. Iloilo Ecclesia"
                required
              />

              <Select
                label="Region"
                name="region"
                defaultValue="Luzon"
                options={[
                  { value: 'Luzon', label: 'Luzon' },
                  { value: 'Visayas', label: 'Visayas' },
                  { value: 'Mindanao', label: 'Mindanao' },
                ]}
                required
              />
            </div>

            {/* 2. City & Contact Person */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City / Municipality"
                name="city"
                placeholder="e.g. Iloilo City"
                required
              />

              <Input
                label="Contact Person & Phone (Optional)"
                name="contactPerson"
                placeholder="e.g. Bro. Stephen Santos (+63 917 123 4567)"
              />
            </div>

            {/* 3. Meeting Schedule */}
            <Textarea
              label="Meeting Schedule & Weekly Times"
              name="meetingSchedule"
              rows={2}
              placeholder="e.g. Sundays 9:30 AM (Memorial Service), Thursdays 7:30 PM (Bible Class)"
              required
            />

            {/* 4. Full Address */}
            <Textarea
              label="Full Physical Address / Hall Location"
              name="address"
              rows={2}
              placeholder="e.g. Jaro District, Iloilo City, Iloilo Province"
              required
            />

            {/* 5. Display in Directory Toggle */}
            <div className="p-4 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-between">
              <div>
                <strong className="block text-xs text-[#2c3324] dark:text-[#fefcf1]">Display in Directory</strong>
                <span className="text-[11px] text-[#707666] dark:text-[#a3ab98]">
                  Visible in Home page metrics, About directory, and Member registration.
                </span>
              </div>
              <input
                type="checkbox"
                name="isDisplayed"
                defaultChecked={true}
                className="h-5 w-5 rounded border-[#e6dfcb] dark:border-[#323d2b] text-[#2c3324] dark:text-[#e0a861] focus:ring-[#e0a861]"
              />
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-end gap-3 border-t border-[#e6dfcb] dark:border-[#323d2b] pt-4">
            <Link href="/admin/ecclesias">
              <Button type="button" variant="outline" size="md">
                <span>Cancel</span>
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="gap-2 shadow-xs"
            >
              <Save className="h-4 w-4" />
              <span>Save Ecclesia</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
