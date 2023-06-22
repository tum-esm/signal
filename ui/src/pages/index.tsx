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
import {
    TableColumnRecordType,
    fetchTableColumns,
} from "@/utilities/fetching/fetch-table-columns";
import {
    TableRecordType,
    fetchTables,
} from "@/utilities/fetching/fetch-tables";
import { PlotPanel } from "@/components/plot-panel";

export default function Page() {
    const [tables, setTables] = useState<TableRecordType[] | undefined>(
        undefined
    );
    const [columns, setColumns] = useState<TableColumnRecordType[] | undefined>(
        undefined
    );

    const [activeCollectionName, setActiveCollectionName] = useState<
        string | undefined
    >(undefined);
    const [activeTableName, setActiveTableName] = useState<string | undefined>(
        undefined
    );

    const collectionNames = tables ? tables.map((t) => t.collectionName) : [];
    const tableNames = tables
        ? tables
              .filter((t) => t.collectionName === activeCollectionName)
              .map((t) => t.tableName)
        : [];
    const pb = new PocketBase("https://esm-linode.dostuffthatmatters.dev");

    // fetch tables on mount
    useEffect(() => {
        async function f() {
            setTables(await fetchTables(pb));
        }
        f();
    }, []);

    // when collectionName changes, set activeCollectionName to undefined
    useEffect(() => {
        setActiveCollectionName(undefined);
    }, [tables]);

    // when collectionName changes, set activeTableName to undefined
    useEffect(() => {
        setActiveTableName(undefined);
    }, [activeCollectionName]);

    // when tableName changes, fetch columns
    useEffect(() => {
        const f = async () => {
            if (
                activeCollectionName !== undefined &&
                activeTableName !== undefined
            ) {
                setColumns(
                    await fetchTableColumns(
                        pb,
                        activeCollectionName,
                        activeTableName
                    )
                );
            }
        };
        f();
    }, [activeCollectionName, activeTableName]);

    return (
        <>
            <header className={`${inter.className} my-6 mx-6`}>
                {collectionNames !== undefined && (
                    <div
                        className={cn(
                            "flex flex-row items-center justify-start gap-x-2"
                        )}
                    >
                        <div className="text-base font-semibold">
                            Collection:
                        </div>
                        <Select
                            onValueChange={(v) => setActiveCollectionName(v)}
                            value={activeCollectionName}
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
                        {activeCollectionName !== undefined && (
                            <>
                                <div className="pl-6 text-base font-semibold">
                                    Table:
                                </div>
                                <Select
                                    onValueChange={(v) => setActiveTableName(v)}
                                    value={activeTableName}
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
            <main className={`${inter.className}`}>
                {activeTableName === undefined && (
                    <div className="mx-6 my-6 text-base font-semibold">
                        Select a collection and table to view columns
                    </div>
                )}
                {activeTableName !== undefined && columns === undefined && (
                    <div className="mx-6 my-6 text-base font-semibold">
                        Loading columns...
                    </div>
                )}
                {columns !== undefined && (
                    <div className="flex flex-col mx-6 my-6">
                        {columns.map((c) => (
                            <PlotPanel key={c.id} tableColumn={c} />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
