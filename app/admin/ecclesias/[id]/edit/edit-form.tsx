'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { updateEcclesiaAction, AdminEcclesiaActionState } from '@/app/actions/ecclesias';
import { type Ecclesia } from '@/lib/db/schema/ecclesias';
import { Church, AlertCircle, Save } from 'lucide-react';

const initialState: AdminEcclesiaActionState = {
  success: false,
};

interface EditEcclesiaFormProps {
  ecclesia: Ecclesia;
}

export function EditEcclesiaForm({ ecclesia }: EditEcclesiaFormProps) {
  const [state, formAction, isPending] = useActionState(updateEcclesiaAction, initialState);

  return (
    <Card className="border-[#e6dfcb] shadow-md">
      <form action={formAction}>
        <input type="hidden" name="id" value={ecclesia.id} />

        <CardHeader className="border-b border-[#e6dfcb] pb-4">
          <div className="flex items-center gap-2">
            <Church className="h-5 w-5 text-[#e0a861]" />
            <CardTitle className="text-xl">Edit Ecclesia: {ecclesia.name}</CardTitle>
          </div>
          <CardDescription>
            Update directory information, location, meeting times, or contact details.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          {state?.error && (
            <div className="p-3.5 rounded-xl bg-[#fdf2f2] border border-[#f5c6cb] text-[#c0392b] text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* 1. Name & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ecclesia Name"
              name="name"
              defaultValue={ecclesia.name}
              placeholder="e.g. Cubao Ecclesia"
              required
              error={state?.fieldErrors?.name?.[0]}
            />

            <Select
              label="Region"
              name="region"
              defaultValue={ecclesia.region}
              options={[
                { value: 'Luzon', label: 'Luzon' },
                { value: 'Visayas', label: 'Visayas' },
                { value: 'Mindanao', label: 'Mindanao' },
              ]}
            />
          </div>

          {/* 2. City & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City / Municipality"
              name="city"
              defaultValue={ecclesia.city}
              placeholder="e.g. Quezon City"
              required
              error={state?.fieldErrors?.city?.[0]}
            />

            <Input
              label="Display Order Index"
              name="orderIndex"
              type="number"
              defaultValue={String(ecclesia.orderIndex)}
              placeholder="0"
              error={state?.fieldErrors?.orderIndex?.[0]}
            />
          </div>

          {/* 3. Address */}
          <Input
            label="Full Physical Address / Hall Location"
            name="address"
            defaultValue={ecclesia.address}
            placeholder="e.g. 12th Avenue, Cubao, Quezon City"
            required
            error={state?.fieldErrors?.address?.[0]}
          />

          {/* 4. Contact Person */}
          <Input
            label="Contact Person & Phone (Optional)"
            name="contactPerson"
            defaultValue={ecclesia.contactPerson || ''}
            placeholder="e.g. Bro. Jonathan Doe (+63 917 123 4567)"
            error={state?.fieldErrors?.contactPerson?.[0]}
          />

          {/* 5. Meeting Schedule */}
          <Textarea
            label="Meeting Schedule"
            name="meetingSchedule"
            defaultValue={ecclesia.meetingSchedule}
            placeholder="e.g. Sundays 9:30 AM (Memorial Service), 11:00 AM (Sunday School)"
            required
            rows={3}
            error={state?.fieldErrors?.meetingSchedule?.[0]}
          />

          {/* 6. Display Toggle */}
          <div className="p-4 rounded-xl bg-[#f8f4e3] border border-[#e6dfcb] flex items-center justify-between">
            <div>
              <strong className="block text-xs text-[#2c3324]">Display in Directory</strong>
              <span className="text-[11px] text-[#707666]">
                Visible in Home page count, About directory, and Member registration.
              </span>
            </div>
            <input
              type="checkbox"
              name="isDisplayed"
              defaultChecked={ecclesia.isDisplayed}
              className="h-5 w-5 rounded border-[#e6dfcb] text-[#2c3324] focus:ring-[#e0a861]"
            />
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end gap-3 border-t border-[#e6dfcb] pt-4">
          <Link href="/admin/ecclesias">
            <Button type="button" variant="outline" size="md">
              <span>Cancel</span>
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isPending}
            className="gap-2 shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
