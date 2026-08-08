'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { createEventAction, AdminEventActionState } from '@/app/actions/events';
import { Calendar, ArrowLeft, AlertCircle, Sparkles, Wand2 } from 'lucide-react';

const initialState: AdminEventActionState = {
  success: false,
};

export default function NewEventPage() {
  const [state, formAction, isPending] = useActionState(createEventAction, initialState);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
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
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-1.5 text-xs text-[#505748] dark:text-[#a3ab98] hover:text-[#2c3324] dark:hover:text-[#fefcf1] font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Events Management</span>
      </Link>

      <Card className="shadow-md">
        <form action={formAction}>
          <CardHeader className="border-b border-[#e6dfcb] dark:border-[#323d2b] pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#e0a861]" />
              <CardTitle className="text-xl">Create New PCYC Event</CardTitle>
            </div>
            <CardDescription>
              Publish a new youth camp or study circle to the public portal and database.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            {state?.error && (
              <div className="p-3.5 rounded-xl bg-[#fdf2f2] dark:bg-[#2d1815] border border-[#f5c6cb] dark:border-[#4d201b] text-[#c0392b] dark:text-[#ef5350] text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {/* 1. Title & URL Slug (with Auto-Fill) */}
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

            {/* 2. Device Image Attachment */}
            <ImageUpload
              name="imageFile"
              label="Event Banner Image"
              helperText="Attach image from device • Max 5MB • PNG or JPG/JPEG format"
              error={state?.fieldErrors?.bannerUrl?.[0]}
            />

            {/* 3. Theme / Motto */}
            <Input
              label="Spiritual Theme / Scriptural Motto (Optional)"
              name="theme"
              placeholder="e.g. Anchored in Hope (Hebrews 6:19)"
              error={state?.fieldErrors?.theme?.[0]}
            />

            {/* 4. Description */}
            <Textarea
              label="Event Description & Details"
              name="description"
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
                  required
                  error={state?.fieldErrors?.startDate?.[0]}
                />
                <Input
                  label="Start Time"
                  name="startTime"
                  type="time"
                  defaultValue="08:00"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  required
                  error={state?.fieldErrors?.endDate?.[0]}
                />
                <Input
                  label="End Time"
                  name="endTime"
                  type="time"
                  defaultValue="17:00"
                  required
                />
              </div>
            </div>

            {/* 6. Location, Max Attendees & Registration Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Location / Ecclesia Hall"
                name="location"
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
                defaultValue="0"
                placeholder="0.00 (0 for Free)"
                helperText="Set to 0 for Free Fellowship"
                error={state?.fieldErrors?.registrationFee?.[0]}
              />

              <Input
                label="Max Attendees Capacity (Optional)"
                name="maxAttendees"
                type="number"
                placeholder="e.g. 120"
                error={state?.fieldErrors?.maxAttendees?.[0]}
              />
            </div>

            {/* 7. Status & Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Event Status"
                name="status"
                defaultValue="UPCOMING"
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
                  <strong className="block text-xs text-[#2c3324] dark:text-[#fefcf1]">Publish Immediately</strong>
                  <span className="text-[11px] text-[#707666] dark:text-[#a3ab98]">Visible on the public portal.</span>
                </div>
                <input
                  type="checkbox"
                  name="isPublished"
                  defaultChecked
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
              <Sparkles className="h-4 w-4" />
              <span>Publish Event</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
