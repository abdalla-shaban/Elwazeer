"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings, useUpdateQuery } from "@/lib/api/hooks";
const SizesFilter = () => {
  const { update } = useUpdateQuery({});
  const { data: settingsData, isLoading: isSettingsDataLoading } =
    useSettings();
  return (
    <RadioGroup dir="rtl" onValueChange={(e) => update({ size: e })}>
      {settingsData?.settings.sizeDescription.map((size, idx) => (
        <div className="flex items-center gap-3" key={idx}>
          <RadioGroupItem id={`filterSize-${idx}`} value={size.size} />
          <Label
            className="flex items-center gap-3"
            key={idx}
            htmlFor={`filterSize-${idx}`}
          >
            <span>{size.size}</span>
            <span>{size.range}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default SizesFilter;
