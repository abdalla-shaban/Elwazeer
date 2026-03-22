"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "../ui/input";

interface KeywordsInputProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function CustomInput({
  id,
  value,
  onChange,
  placeholder,
}: KeywordsInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newKeyword = input.trim();

      if (!newKeyword || value.includes(newKeyword)) return;

      onChange([...value, newKeyword]);
      setInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    onChange(value.filter((k) => k !== keyword));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Input */}
      <Input
        id={id}
        // className="border border-input rounded-md px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {/* Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((keyword) => (
            <span
              key={keyword}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 rounded-full"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="cursor-pointer text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
