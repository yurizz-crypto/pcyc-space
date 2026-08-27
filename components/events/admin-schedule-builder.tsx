'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

interface AdminScheduleBuilderProps {
  initialSchedule?: ScheduleItem[];
}

export function AdminScheduleBuilder({ initialSchedule }: AdminScheduleBuilderProps) {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(
    initialSchedule && initialSchedule.length > 0
      ? initialSchedule
      : [{ time: '08:00 AM', title: 'Registration & Welcome', description: 'Get your kits and settle in.' }]
  );

  const addItem = () => {
    setSchedule([...schedule, { time: '', title: '', description: '' }]);
  };

  const removeItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ScheduleItem, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="schedule" value={JSON.stringify(schedule)} />
      
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-[#2c3324] dark:text-[#fefcf1]">
          Event Schedule
        </label>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8 text-xs">
          <Plus className="h-3 w-3 mr-1" /> Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {schedule.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 border border-[#e6dfcb] dark:border-[#323d2b] rounded-lg bg-[#fbfbf9] dark:bg-[#1b2117]">
            <div className="mt-2 text-[#a3ab98] cursor-move">
              <GripVertical className="h-4 w-4" />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Time (e.g. 08:00 AM)"
                value={item.time}
                onChange={(e) => updateItem(index, 'time', e.target.value)}
                className="h-9 text-sm"
              />
              <Input
                placeholder="Title (e.g. Opening Session)"
                value={item.title}
                onChange={(e) => updateItem(index, 'title', e.target.value)}
                className="h-9 text-sm"
              />
              <div className="sm:col-span-2">
                <Input
                  placeholder="Short description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="mt-1 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {schedule.length === 0 && (
          <div className="text-center py-6 text-sm text-[#707666] border border-dashed rounded-lg">
            No schedule items. Add one to show the timeline.
          </div>
        )}
      </div>
    </div>
  );
}
