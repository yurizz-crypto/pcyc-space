'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { updateEventAction, AdminEventActionState } from '@/app/actions/events';
import { Event } from '@/lib/db/schema/events';
import { formatDateForDateInput, formatTimeForTimeInput } from '@/lib/utils';
import { Calendar, AlertCircle, Save, Wand2 } from 'lucide-react';
import { AdminScheduleBuilder } from '@/components/events/admin-schedule-builder';
import { AdminChecklistBuilder } from '@/components/events/admin-checklist-builder';

const initialState: AdminEventActionState = {
  success: false,
};

interface EditEventFormProps {
  event: Event;
}

export function EditEventForm({ event }: EditEventFormProps) {
  const [state, formAction, isPending] = useActionState(updateEventAction, initialState);
  const [title, setTitle] = useState(event.title);
  const [slug, setSlug] = useState(event.slug);
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);

  // Helper to generate clean URL slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-fill URL slug from Title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsManuallyEdited(true);
  };

  const handleRegenerateSlug = () => {
    setSlug(generateSlug(title));
    setIsManuallyEdited(false);
  };

  return (
    <Card className="shadow-md">
      <form action={formAction}>
        <input type="hidden" name="eventId" value={event.id} />
        <input type="hidden" name="existingBannerUrl" value={event.bannerUrl || ''} />

        <CardHeader className="border-b border-[#e6dfcb] dark:border-[#323d2b] pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#e0a861]" />
            <CardTitle className="text-xl">Edit Event: {event.title}</CardTitle>
          </div>
          <CardDescription>
            Update event schedules, details, capacity, or publication status.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-6">
          {state?.error && (
            <div className="p-3.5 rounded-xl bg-[#fdf2f2] dark:bg-[#2d1815] border border-[#f5c6cb] dark:border-[#4d201b] text-[#c0392b] dark:text-[#ef5350] text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* 1. Title & URL Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Event Title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. PCYC National Youth Camp 2026"
              required
              error={state?.fieldErrors?.title?.[0]}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#2c3324] dark:text-[#fefcf1] uppercase tracking-wider">
                  URL Slug (Permanent Link) <span className="text-[#c0392b]">*</span>
                </label>
                {isManuallyEdited && (
                  <button
                    type="button"
                    onClick={handleRegenerateSlug}
                    className="inline-flex items-center gap-1 text-[11px] text-[#e0a861] hover:underline font-medium"
                  >
                    <Wand2 className="h-3 w-3" />
                    <span>Re-sync with Title</span>
                  </button>
                )}
              </div>
              <Input
                name="slug"
                value={slug}
                onChange={handleSlugChange}
                placeholder="e.g. pcyc-national-youth-camp-2026"
                required
                helperText={slug ? `Preview: pcyc.ph/events/${slug}` : 'Auto-filled as you type the title'}
                error={state?.fieldErrors?.slug?.[0]}
              />
            </div>
          </div>

          {/* 2. Existing Banner Preview & Device Image Attachment */}
          <div className="space-y-3">
            {event.bannerUrl && (
              <div className="p-3 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center gap-4">
                <div className="relative h-16 w-24 rounded-lg overflow-hidden border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117] shrink-0">
                  <Image
                    src={event.bannerUrl}
                    alt="Current Banner"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs space-y-0.5">
                  <strong className="block text-[#2c3324] dark:text-[#fefcf1]">Current Banner Image</strong>
                  <p className="text-[#707666] dark:text-[#a3ab98]">Upload a new image below if you wish to replace it.</p>
                </div>
              </div>
            )}

            <ImageUpload
              name="imageFile"
              label="Replace Event Banner (Optional)"
              helperText="Attach new image from device • Max 5MB • PNG or JPG/JPEG format"
              error={state?.fieldErrors?.bannerUrl?.[0]}
            />
          </div>

          {/* 3. Theme / Motto */}
          <Input
            label="Spiritual Theme / Scriptural Motto (Optional)"
            name="theme"
            defaultValue={event.theme || ''}
            placeholder="e.g. Anchored in Hope (Hebrews 6:19)"
            error={state?.fieldErrors?.theme?.[0]}
          />

          {/* 4. Description */}
          <Textarea
            label="Event Description & Details"
            name="description"
            defaultValue={event.description}
            placeholder="Provide an overview of the event, spiritual study themes, accommodation notes..."
            required
            rows={4}
            error={state?.fieldErrors?.description?.[0]}
          />

          {/* 5. Schedule & Times (Start & End) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                defaultValue={formatDateForDateInput(event.startDate)}
                required
                error={state?.fieldErrors?.startDate?.[0]}
              />
              <Input
                label="Start Time"
                name="startTime"
                type="time"
                defaultValue={formatTimeForTimeInput(event.startDate)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="End Date"
                name="endDate"
                type="date"
                defaultValue={formatDateForDateInput(event.endDate)}
                required
                error={state?.fieldErrors?.endDate?.[0]}
              />
              <Input
                label="End Time"
                name="endTime"
                type="time"
                defaultValue={formatTimeForTimeInput(event.endDate)}
                required
              />
            </div>
          </div>

          {/* 6. Location, Max Attendees & Registration Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Location / Ecclesia Hall"
              name="location"
              defaultValue={event.location}
              placeholder="e.g. Cubao Ecclesial Hall, Quezon City"
              required
              error={state?.fieldErrors?.location?.[0]}
            />

            <Input
              label="Registration Fee (₱ PHP)"
              name="registrationFee"
              type="number"
              step="0.01"
              min="0"
              defaultValue={event.registrationFee ? String(Number(event.registrationFee)) : '0'}
              placeholder="0.00 (0 for Free)"
              helperText="Set to 0 for Free Fellowship"
              error={state?.fieldErrors?.registrationFee?.[0]}
            />

            <Input
              label="Max Attendees Capacity (Optional)"
              name="maxAttendees"
              type="number"
              defaultValue={event.maxAttendees ? String(event.maxAttendees) : ''}
              placeholder="e.g. 120"
              error={state?.fieldErrors?.maxAttendees?.[0]}
            />
          </div>

          {/* 7. Schedule & Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white/50 dark:bg-black/20">
              <AdminScheduleBuilder initialSchedule={event.schedule as any} />
            </div>
            <div className="p-4 rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white/50 dark:bg-black/20">
              <AdminChecklistBuilder initialChecklist={event.checklist as any} />
            </div>
          </div>

          {/* 8. Status & Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Event Status"
              name="status"
              defaultValue={event.status}
              options={[
                { value: 'UPCOMING', label: 'Upcoming (Open for registration)' },
                { value: 'ONGOING', label: 'Ongoing (Currently running)' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' },
                { value: 'ARCHIVED', label: 'Archived (Historical record)' },
              ]}
            />

            <div className="p-4 rounded-xl bg-[#f8f4e3] dark:bg-[#252e1f] border border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-between">
              <div>
                <strong className="block text-xs text-[#2c3324] dark:text-[#fefcf1]">Published Status</strong>
                <span className="text-[11px] text-[#707666] dark:text-[#a3ab98]">Visible on public portal.</span>
              </div>
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={event.isPublished}
                className="h-5 w-5 rounded border-[#e6dfcb] dark:border-[#323d2b] text-[#2c3324] dark:text-[#e0a861] focus:ring-[#e0a861]"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end gap-3 border-t border-[#e6dfcb] dark:border-[#323d2b] pt-4">
          <Link href="/admin/events">
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
