"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings2 } from "lucide-react";

interface ConstantsContainerProps {
  children: ReactNode;
}

export function ConstantsContainer({ children }: ConstantsContainerProps) {
  return (
    <Card className="border-2 border-primary/10 shadow-sm overflow-hidden transition-all hover:border-primary/20 bg-background/50 backdrop-blur-sm">
      <CardHeader className="bg-muted/30 border-b py-5 px-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2.5 rounded-xl shadow-inner ring-1 ring-primary/20">
            <Settings2 className="size-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">إدارة الثوابت</CardTitle>
            <CardDescription className="text-sm mt-0.5 text-muted-foreground/80">
              قم بتعديل التصنيفات، الخامات، المقاسات والمواسم المتاحة في المتجر
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-8 px-6 pb-8">
        <div className="grid gap-8">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
