import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcnui/select";
import { cn } from "@/utilities/class-names";
import { useEffect, useMemo, useState } from "react";
import { TableRecordType, fetchTables } from "@/utilities/fetching/tables";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcnui/tabs";
import {
    TablerIconTimeDuration10,
    TablerIconTimeDuration30,
    TablerIconTimeDuration60,
    TablerIconTimeDurationOff,
} from "@/components/custom/icons";
import { LayoutCookieType, loadLayoutCookie } from "@/utilities/layout-cookies";
import { PlotGrid } from "@/components/custom/plot-grid";

export default function Page() {
    const [tables, setTables] = useState<TableRecordType[] | undefined>(
        undefined
    );
    const [activeCollectionName, setActiveCollectionName] = useState<
        string | undefined
    >(undefined);
    const [activeTableName, setActiveTableName] = useState<string | undefined>(
        undefined
    );
    const collectionNames = useMemo(() => {
        return tables ? tables.map((t) => t.collectionName) : [];
    }, [tables]);
    const tableNames = useMemo(
        () =>
            tables
                ? tables
                      .filter((t) => t.collectionName === activeCollectionName)
                      .map((t) => t.tableName)
                : [],
        [tables, activeCollectionName]
    );
    const [timeBin, setTimeBin] = useState<15 | 60 | 240 | 720>(60);
    const [refreshPeriod, setRefreshPeriod] = useState<-1 | 10 | 30 | 60>(-1);
    function updateRefreshPeriod() {
        if (refreshPeriod === -1) {
            setRefreshPeriod(10);
        } else if (refreshPeriod === 10) {
            setRefreshPeriod(30);
        } else if (refreshPeriod === 30) {
            setRefreshPeriod(60);
        } else {
            setRefreshPeriod(-1);
        }
    }

    // fetch tables on mount
    useEffect(() => {
        async function f() {
            setTables(await fetchTables());
        }
        f();
    }, []);

    // when tables change, set activeCollectionName to undefined
    useEffect(() => {
        if (collectionNames.length === 1) {
            setActiveCollectionName(collectionNames[0]);
        } else {
            setActiveCollectionName(undefined);
        }
    }, [collectionNames]);

    useEffect(() => {
        if (tableNames.length === 1) {
            setActiveTableName(tableNames[0]);
        } else {
            setActiveTableName(undefined);
        }
    }, [tableNames]);

    const [layoutCookie, setLayoutCookie] = useState<
        LayoutCookieType | undefined
    >();
    useEffect(() => {
        setLayoutCookie(loadLayoutCookie());
    }, []);

    return (
        <>
            <header
                className={`${inter.className} flex items-center h-16 px-6 border-b border-slate-200`}
            >
                {collectionNames !== undefined && (
                    <div
                        className={cn(
                            "flex flex-row items-center justify-start gap-x-2 w-full"
                        )}
                    >
                        <div className="text-base font-medium">Collection</div>
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
                                <div className="text-base font-medium">
                                    Table
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
                        <div className="flex-grow" />
                        <div className="w-px h-16 mx-3 bg-slate-200" />
                        <Tabs
                            className="w-[400px]"
                            value={timeBin.toString()}
                            // @ts-ignore
                            onValueChange={(v) => setTimeBin(parseInt(v))}
                        >
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="15">15 minutes</TabsTrigger>
                                <TabsTrigger value="60">1 hour</TabsTrigger>
                                <TabsTrigger value="240">4 hours</TabsTrigger>
                                <TabsTrigger value="720">12 hours</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="w-px h-16 mx-3 bg-slate-200" />
                        <div className="text-base font-medium">Refresh</div>
                        <button
                            className={cn(
                                "p-2 rounded-md shadow-sm w-[3.75rem] h-9",
                                "border border-slate-200 hover:bg-slate-50 hover:shadow",
                                "flex flex-row items-center justify-center gap-x-3"
                            )}
                            onClick={updateRefreshPeriod}
                            title="refresh period"
                        >
                            {refreshPeriod === -1 && (
                                <TablerIconTimeDurationOff />
                            )}
                            {refreshPeriod === 10 && (
                                <TablerIconTimeDuration10 />
                            )}
                            {refreshPeriod === 30 && (
                                <TablerIconTimeDuration30 />
                            )}
                            {refreshPeriod === 60 && (
                                <TablerIconTimeDuration60 />
                            )}
                            {refreshPeriod === -1 && (
                                <div className="relative flex-shrink-0 w-2 h-2 mr-1 rounded-full bg-slate-400" />
                            )}
                            {refreshPeriod !== -1 && (
                                <div className="relative flex-shrink-0 w-2 h-2 mr-1">
                                    <div className="absolute top-0 right-0 w-2 h-2 bg-teal-500 rounded-full animate-ping" />
                                    <div className="absolute w-2 h-2 bg-teal-500 rounded-full" />
                                </div>
                            )}
                        </button>
                    </div>
                )}
            </header>
            <main
                className={cn(
                    inter.className,
                    "p-4 gap-y-4 flex flex-col bg-slate-50",
                    "min-h-[calc(100vh-4rem)]"
                )}
            >
                {(activeCollectionName === undefined ||
                    activeTableName === undefined) && (
                    <div className="mx-6 my-6 text-base font-semibold">
                        Select a collection and table to view columns
                    </div>
                )}
                {activeCollectionName !== undefined &&
                    activeTableName !== undefined && (
                        <>
                            {layoutCookie === undefined && (
                                <div className="mx-6 my-6 text-base font-semibold">
                                    Loading Layout from Cookie
                                </div>
                            )}
                            {layoutCookie !== undefined && (
                                <PlotGrid
                                    layoutCookie={layoutCookie}
                                    collectionName={activeCollectionName}
                                    tableName={activeTableName}
                                    timeBin={timeBin}
                                    refreshPeriod={refreshPeriod}
                                />
                            )}
                        </>
                    )}
            </main>
        </>
    );
}
