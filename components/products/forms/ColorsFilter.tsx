"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { colors } from "@/constants";
import { useUpdateQuery } from "@/lib/api/hooks";

const ColorsFilter = () => {
  const { update } = useUpdateQuery({});
  return (
    <div className="space-y-3">
      <RadioGroup dir="rtl" onValueChange={(e) => update({ color: e })}>
        {colors.map((color, idx) => (
          <div className="flex items-center gap-3" key={idx}>
            <RadioGroupItem id={`filterColor-${idx}`} value={color.name} />
            <Label
              className="flex items-center gap-3"
              key={idx}
              htmlFor={`filterColor-${idx}`}
            >
              {color.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ColorsFilter;
