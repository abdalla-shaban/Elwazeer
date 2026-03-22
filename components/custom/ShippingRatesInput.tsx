import { Plus, X } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface ShippingRatesRef {
  commitAll: () => void;
}

interface ShippingRatesInputProps {
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
}

export const ShippingRatesInput = forwardRef<
  ShippingRatesRef,
  ShippingRatesInputProps
>(function ShippingRatesInput({ value = {}, onChange }, ref) {
  const [names, setNames] = useState<Record<string, string>>(() => {
    const initialNames: Record<string, string> = {};
    Object.keys(value).forEach((k) => {
      initialNames[k] = k;
    });
    return initialNames;
  });
  useEffect(() => {
    const initialNames: Record<string, string> = {};
    Object.keys(value).forEach((k) => (initialNames[k] = k));

    const timer = setTimeout(() => setNames(initialNames));
    return () => clearTimeout(timer);
  }, [value]);
  const isDuplicate = (name: string, currentKey: string) =>
    Object.keys(value).some(
      (k) => k !== currentKey && k.toLowerCase() === name.toLowerCase()
    );

  const commitGovName = (oldGov: string, rate: number) => {
    const newGov = names[oldGov]?.trim();
    if (!newGov) {
      toast.error("اسم المحافظة لا يمكن أن يكون فارغًا");
      setNames((p) => ({ ...p, [oldGov]: oldGov }));
      return;
    }
    if (isDuplicate(newGov, oldGov)) {
      toast.error("اسم المحافظة مكرر");
      setNames((p) => ({ ...p, [oldGov]: oldGov }));
      return;
    }
    if (newGov === oldGov) return;

    const updated = { ...value };
    delete updated[oldGov];
    updated[newGov] = rate;
    onChange(updated);

    // update local names mapping
    setNames((prev) => {
      const next = { ...prev };
      delete next[oldGov];
      next[newGov] = newGov;
      return next;
    });
  };

  // ✅ Put useImperativeHandle here, after commitGovName is defined
  useImperativeHandle(ref, () => ({
    commitAll() {
      Object.entries(value).forEach(([gov, rate]) => commitGovName(gov, rate));
    },
  }));

  const updateRate = (gov: string, rate: number) => {
    onChange({ ...value, [gov]: rate });
  };

  const removeGov = (gov: string) => {
    const updated = { ...value };
    delete updated[gov];
    onChange(updated);
    setNames((prev) => {
      const next = { ...prev };
      delete next[gov];
      return next;
    });
  };

  const addGov = () => {
    const base = "محافظة جديدة";
    let name = base;
    let i = 1;
    while (value[name]) name = `${base} ${i++}`;
    onChange({ ...value, [name]: 0 });
  };

  return (
    <div className="space-y-4">
      {Object.entries(value).map(([gov, rate]) => (
        <div
          key={gov}
          className="flex flex-col md:flex-row md:items-center gap-3"
        >
          <Input
            value={names[gov] ?? ""}
            onChange={(e) => setNames((p) => ({ ...p, [gov]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            onBlur={() => commitGovName(gov, rate)}
            placeholder="المحافظة"
          />
          <Input
            type="number"
            min={0}
            value={rate}
            onChange={(e) => updateRate(gov, Number(e.target.value))}
            onWheel={(e) => e.currentTarget.blur()}
            placeholder="سعر الشحن"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeGov(gov)}
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addGov}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        إضافة محافظة
      </Button>
    </div>
  );
});
