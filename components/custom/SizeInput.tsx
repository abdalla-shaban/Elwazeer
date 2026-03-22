"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export interface SizeItem {
  size: string;
  range: string;
}

interface SizeInputProps {
  id: string;
  value: SizeItem[];
  onChange: (value: SizeItem[]) => void;
}

export function SizeInput({ value, onChange }: SizeInputProps) {
  const [size, setSize] = useState("");
  const [range, setRange] = useState("");

  const addSize = () => {
    if (!size.trim() || !range.trim()) return;

    const exists = value.some(
      (v) =>
        v.size.toLowerCase() === size.toLowerCase() &&
        v.range.toLowerCase() === range.toLowerCase()
    );

    if (exists) return;

    onChange([
      ...value,
      {
        size: size.trim(),
        range: range.trim(),
      },
    ]);

    setSize("");
    setRange("");
  };

  const removeSize = (
    item: {
      size: string;
      range: string;
    },
    idx: number
  ) => {
    onChange(value.filter((item, fIdx) => fIdx !== idx));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Inputs */}
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          placeholder="المقاس (مثال: XL)"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <Input
          placeholder="المدى (مثال: 40-42)"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSize();
            }
          }}
        />
        <Button
          onClick={addSize}
          disabled={!size.trim() || !range.trim()}
          type="button"
        >
          <Plus size={16} />
          إضافة
        </Button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {value.map((item, idx) => (
          <span
            key={idx}
            className="flex pe-2 items-center gap-2 text-sm border-4 bg-white rounded"
          >
            <span className="border-l-4 p-3">{item.size}</span>
            <span className="text-muted-foreground px-2">{item.range}</span>
            <button
              type="button"
              onClick={() => removeSize(item, idx)}
              className="cursor-pointer size-5 flex items-center justify-center border rounded-full text-red-500 hover:text-red-700"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
