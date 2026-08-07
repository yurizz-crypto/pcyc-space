'use client';

import React, { useState } from 'react';

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'One Size'];

interface SizeSelectorProps {
  initialSizes?: string[];
  name?: string;
}

export function SizeSelector({ initialSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'], name = 'sizes' }: SizeSelectorProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes);

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      // Don't allow deselecting all
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== size));
      }
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const selectAll = () => {
    setSelectedSizes(STANDARD_SIZES.filter((s) => s !== 'One Size'));
  };

  const selectOneSizeOnly = () => {
    setSelectedSizes(['One Size']);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-[#f8f4e3] border border-[#e6dfcb]">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-[#2c3324] uppercase tracking-wider block">
            Available Manufactured Sizes
          </label>
          <span className="text-[11px] text-[#707666]">
            Select all sizes currently open for member ordering
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-[11px] font-bold text-[#9a6423] hover:underline"
          >
            All Apparel
          </button>
          <span className="text-[11px] text-[#707666]">|</span>
          <button
            type="button"
            onClick={selectOneSizeOnly}
            className="text-[11px] font-bold text-[#9a6423] hover:underline"
          >
            One Size
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {STANDARD_SIZES.map((size) => {
          const isSelected = selectedSizes.includes(size);
          return (
            <label
              key={size}
              className={`flex items-center justify-center min-w-[50px] h-10 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#2c3324] bg-[#2c3324] text-[#fefcf1] shadow-xs ring-1 ring-[#2c3324]'
                  : 'border-[#e6dfcb] bg-white text-[#505748] hover:bg-[#e6dfcb]/40'
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={size}
                checked={isSelected}
                onChange={() => toggleSize(size)}
                className="sr-only"
              />
              <span>{size}</span>
            </label>
          );
        })}
      </div>

      <p className="text-[11px] text-[#707666] pt-1">
        Active in store: <strong className="text-[#2c3324]">{selectedSizes.join(', ')}</strong>
      </p>
    </div>
  );
}
