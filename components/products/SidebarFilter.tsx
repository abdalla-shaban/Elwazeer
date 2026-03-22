"use client";
import { useSettings, useUpdateQuery } from "@/lib/api/hooks";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, RotateCcw } from "lucide-react";

const SidebarFilter = () => {
  const params = useSearchParams();
  const { data: settingsData } = useSettings();
  const { update, resetAll, isPending } = useUpdateQuery({ targetURL: "store" });

  const activeCategory = params.get("category");
  const activeFabric = params.get("fabric");
  const activeSize = params.get("size");

  const hasAnyFilter = activeCategory || activeFabric || activeSize;

  return (
    <div className={`w-full max-w-[280px] bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-contain hidden lg:block transition-opacity duration-300 ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-black text-slate-800">تصفية النتائج</h2>
        {hasAnyFilter && (
          <button 
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="size-3.5" />
            مسح الكل
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6 border-b border-slate-100 pb-6">
        <Collapsible defaultOpen className="space-y-4">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex flex-1 items-center justify-between text-lg font-bold text-slate-800 hover:text-primary transition-colors group">
              الأقسام
              <ChevronDown className="size-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform duration-300 mr-2" />
            </CollapsibleTrigger>
            {activeCategory && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  update({ category: null, page: 1 });
                }}
                className="text-xs font-bold text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 hover:bg-red-50 px-2 py-1 rounded-md transition-colors mr-3"
              >
                مسح
              </button>
            )}
          </div>
          <CollapsibleContent className="space-y-4">
            {settingsData?.settings.category.map((cat, idx) => {
              const isChecked = activeCategory === cat;
              return (
                <div key={idx} className="flex items-center gap-3 group">
                  <Checkbox 
                    id={`cat-${idx}`} 
                    checked={isChecked}
                    onCheckedChange={() => update({ category: isChecked ? null : cat, page: 1 })}
                    className="size-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label 
                    htmlFor={`cat-${idx}`}
                    className={`font-medium text-base cursor-pointer transition-colors ${isChecked ? "text-primary font-bold" : "text-slate-600 group-hover:text-slate-900"}`}
                  >
                    {cat}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Fabrics */}
      <div className="mb-6 border-b border-slate-100 pb-6">
        <Collapsible defaultOpen className="space-y-4">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex flex-1 items-center justify-between text-lg font-bold text-slate-800 hover:text-primary transition-colors group">
              الخامات
              <ChevronDown className="size-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform duration-300 mr-2" />
            </CollapsibleTrigger>
            {activeFabric && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  update({ fabric: null, page: 1 });
                }}
                className="text-xs font-bold text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 hover:bg-red-50 px-2 py-1 rounded-md transition-colors mr-3"
              >
                مسح
              </button>
            )}
          </div>
          <CollapsibleContent className="space-y-4">
            {settingsData?.settings.fabric.map((fab, idx) => {
              const isChecked = activeFabric === fab;
              return (
                <div key={idx} className="flex items-center gap-3 group">
                  <Checkbox 
                    id={`fab-${idx}`} 
                    checked={isChecked}
                    onCheckedChange={() => update({ fabric: isChecked ? null : fab, page: 1 })}
                    className="size-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label 
                    htmlFor={`fab-${idx}`}
                    className={`font-medium text-base cursor-pointer transition-colors ${isChecked ? "text-primary font-bold" : "text-slate-600 group-hover:text-slate-900"}`}
                  >
                    {fab}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Sizes */}
      <div className="mb-4">
        <Collapsible defaultOpen className="space-y-4">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger className="flex flex-1 items-center justify-between text-lg font-bold text-slate-800 hover:text-primary transition-colors group">
              المقاس
              <ChevronDown className="size-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform duration-300 mr-2" />
            </CollapsibleTrigger>
            {activeSize && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  update({ size: null, page: 1 });
                }}
                className="text-xs font-bold text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 hover:bg-red-50 px-2 py-1 rounded-md transition-colors mr-3"
              >
                مسح
              </button>
            )}
          </div>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-2.5 mt-2">
              {settingsData?.settings.sizeDescription.map((sizeObj, idx) => {
                const isChecked = activeSize === sizeObj.size;
                return (
                  <button
                    key={idx}
                    onClick={() => update({ size: isChecked ? null : sizeObj.size, page: 1 })}
                    className={`flex items-center justify-center size-11 rounded-full border text-sm font-black transition-all duration-300 ${
                      isChecked 
                        ? "border-primary bg-primary/10 text-primary scale-110 shadow-sm ring-2 ring-primary/20 ring-offset-1" 
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {sizeObj.size}
                  </button>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
export default SidebarFilter;
