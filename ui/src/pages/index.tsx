import { Inter } from "next/font/google";
import PocketBase from "pocketbase";

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
import { useEffect, useState } from "react";

export default function Page() {
  const [rawtableRecords, setRawTableRecords] = useState<
    { id: string; collection_name: string; table_name: string }[] | undefined
  >(undefined);

  const [collectionNames, setCollectionNames] = useState<string[] | undefined>(
    undefined
  );
  const [collectionName, setCollectionName] = useState<string | undefined>(
    undefined
  );

  const [tableNames, setTableNames] = useState<string[] | undefined>(undefined);
  const [tableName, setTableName] = useState<string | undefined>(undefined);

  //const [columns, setColumns] = useState<string[] | undefined>(undefined);

  async function fetchSignalTables() {
    const pb = new PocketBase("https://esm-linode.dostuffthatmatters.dev");
    const resultList = await pb.collection("signal_tables").getFullList();
    setRawTableRecords(
      resultList.map((r) => ({
        id: r.id,
        collection_name: r.collection_name,
        table_name: r.table_name,
      }))
    );
  }

  useEffect(() => {
    fetchSignalTables();
  }, []);

  useEffect(() => {
    if (rawtableRecords) {
      setCollectionNames(
        Array.from(new Set(rawtableRecords.map((r) => r.collection_name)))
      );
    }
  }, [rawtableRecords]);

  // when collectionName changes, set tableNames
  useEffect(() => {
    setTableName(undefined);
    if (collectionName === undefined) {
      setTableNames(undefined);
    } else {
      const filtered = rawtableRecords?.filter(
        (r) => r.collection_name === collectionName
      );
      setTableNames(Array.from(new Set(filtered?.map((r) => r.table_name))));
    }
  }, [collectionName]);

  return (
    <>
      <header className={`${inter.className} my-6 mx-6`}>
        {collectionNames !== undefined && (
          <div
            className={cn("flex flex-row items-center justify-start gap-x-2")}
          >
            <div className="text-base font-semibold">Collection:</div>
            <Select
              onValueChange={(v) => setCollectionName(v)}
              value={collectionName}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {collectionNames.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {tableNames !== undefined && (
              <>
                <div className="pl-6 text-base font-semibold">Table:</div>
                <Select
                  onValueChange={(v) => setTableName(v)}
                  value={tableName}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tableNames.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        )}
      </header>
      <main className={`${inter.className}`}>body</main>
    </>
  );
}
