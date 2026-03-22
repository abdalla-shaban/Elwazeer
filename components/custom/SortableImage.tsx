import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ControllerRenderProps } from "react-hook-form";
import { formSchema } from "../products/forms/AddProductForm";
import z from "zod";

export default function SortableImage({
  id,
  index,
  src,
  onRemove,
  field,
}: {
  id: string;
  index: number;
  src: string;
  onRemove: () => void;
  field: ControllerRenderProps<z.infer<typeof formSchema>, "images">;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const currentColor = field.value[index]?.color || {
    name: "",
    hexCode: "#000000",
  };

  const handleColorChange = (newColor: { name?: string; hexCode?: string }) => {
    const updatedImages = [...field.value];
    updatedImages[index] = {
      ...updatedImages[index],
      color: {
        ...updatedImages[index].color,
        ...newColor,
      },
    };
    field.onChange(updatedImages);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`border rounded-md group ${
        index === 0 ? "border-primary border-2" : ""
      }`}
    >
      <div className="overflow-hidden aspect-square rounded-md rounded-b-none relative">
        {index === 0 && (
          <span className="absolute z-10 bottom-1 left-1 bg-primary/70 backdrop-blur-md text-white text-xs px-2 py-1 rounded">
            الصورة الرئيسية
          </span>
        )}
        <div
          {...listeners}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Image
            src={src}
            alt="preview"
            fill
            className="object-cover object-top"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition"
          onClick={(e) => {
            e.stopPropagation(); // important for drag
            onRemove();
          }}
        >
          <X className="w-4 h-4 text-red-600" />
        </Button>
      </div>
      <div className="flex py-2 items-center gap-2 px-0.5">
        <div className="relative">
          <Input
            type="color"
            value={currentColor.hexCode || "#000000"}
            onChange={(e) => {
              handleColorChange({ hexCode: e.target.value });
            }}
            id={`color-${index}`}
            className="sr-only"
          />
          <Label
            htmlFor={`color-${index}`}
            className="size-10 cursor-pointer flex items-center justify-center min-w-10 min-h-10 border shadow rounded-full"
            style={{
              backgroundColor: currentColor.hexCode || "#000000",
            }}
          >
            <span className="size-5 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-full">
              🎨
            </span>
          </Label>
        </div>
        <Input
          value={currentColor.name}
          placeholder="اسم اللون"
          onChange={(e) => handleColorChange({ name: e.target.value })}
          className="bg-white text-center text-black"
        />
      </div>
    </div>
  );
}
