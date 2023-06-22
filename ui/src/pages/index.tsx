import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Page() {
  const [collection, setCollection] = useState<string | null>(null);
  const [table, setTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[] | null>(null);

  return (
    <>
      <header className={`${inter.className} my-6 mx-6`}>
        <div className={cn("flex flex-row items-center justify-start gap-x-2")}>
          <div>Collection:</div>
          <Select onValueChange={(v) => setCollection(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="pl-6">Table:</div>
          <Select onValueChange={(v) => setTable(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a table" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </header>
      <main className={`${inter.className}`}>body</main>
    </>
  );
}
