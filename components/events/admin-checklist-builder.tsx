'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface AdminChecklistBuilderProps {
  initialChecklist?: string[];
}

export function AdminChecklistBuilder({ initialChecklist }: AdminChecklistBuilderProps) {
  const [checklist, setChecklist] = useState<string[]>(
    initialChecklist && initialChecklist.length > 0
      ? initialChecklist
      : ['Bible and Notebook', 'Comfortable Clothes', 'Personal Toiletries']
  );

  const addItem = () => {
    setChecklist([...checklist, '']);
  };

  const removeItem = (index: number) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const newChecklist = [...checklist];
    newChecklist[index] = value;
    setChecklist(newChecklist);
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="checklist" value={JSON.stringify(checklist)} />
      
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-[#2c3324] dark:text-[#fefcf1]">
          Packing Checklist
        </label>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8 text-xs">
          <Plus className="h-3 w-3 mr-1" /> Add Item
        </Button>
      </div>

      <div className="space-y-2">
        {checklist.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="text-[#a3ab98] cursor-move">
              <GripVertical className="h-4 w-4" />
            </div>
            <Input
              placeholder="e.g. Bible and Notebook"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="h-9 text-sm flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {checklist.length === 0 && (
          <div className="text-center py-4 text-sm text-[#707666] border border-dashed rounded-lg">
            No checklist items. Add one for the delegates.
          </div>
        )}
      </div>
    </div>
  );
}
