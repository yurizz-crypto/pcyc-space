'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
      {/* Back Link */}
      <div>
        <Link
          href="/admin/ecclesias"
          className="inline-flex items-center gap-1.5 text-xs text-[#707666] hover:text-[#2c3324] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Ecclesia Directory</span>
        </Link>
      </div>

      {/* Form Card */}
      <Card className="border-[#e6dfcb]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#e0a861]/15 text-[#9a6423] flex items-center justify-center">
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
        <CardContent>
          <form
            action={async (formData) => {
              setIsSubmitting(true);
              await createEcclesiaAction(formData);
              setIsSubmitting(false);
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ecclesia Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[#2c3324]">
                  Ecclesia Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  placeholder="e.g. Iloilo Ecclesia"
                  required
                />
              </div>

              {/* Region */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2c3324]">
                  Region <span className="text-red-500">*</span>
                </label>
                <Select
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

              {/* City / Province */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2c3324]">
                  City / Municipality <span className="text-red-500">*</span>
                </label>
                <Input
                  name="city"
                  placeholder="e.g. Iloilo City"
                  required
                />
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2c3324]">
                Complete Address Details <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="address"
                rows={2}
                placeholder="e.g. Jaro District, Iloilo City, Iloilo Province"
                required
              />
            </div>

            {/* Meeting Schedule */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2c3324]">
                Meeting Schedule <span className="text-red-500">*</span>
              </label>
              <Input
                name="meetingSchedule"
                placeholder="e.g. Sundays 9:30 AM (Memorial Service), Thursdays 7:30 PM (Bible Class)"
                required
              />
            </div>

            {/* Contact Person */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2c3324]">
                  Contact Person / Brother (Optional)
                </label>
                <Input
                  name="contactPerson"
                  placeholder="e.g. Bro. Stephen Santos"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2c3324]">
                  Display Order Index
                </label>
                <Input
                  name="orderIndex"
                  type="number"
                  defaultValue="0"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-4 border-t border-[#f0ebd3] flex items-center justify-end gap-3">
              <Link href="/admin/ecclesias">
                <Button type="button" variant="outline" size="md">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="gap-2 shadow-xs"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving Ecclesia...' : 'Save Ecclesia'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
