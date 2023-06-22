import { cn } from "@/lib/utils";
import { DataRecordType, fetchData } from "@/utilities/fetching/fetch-data";
import { TableColumnRecordType } from "@/utilities/fetching/fetch-table-columns";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";

export function PlotPanel(props: { tableColumn: TableColumnRecordType }) {
    const [data, setData] = useState<DataRecordType[] | undefined>(undefined);
    const pb = new PocketBase("https://esm-linode.dostuffthatmatters.dev");

    useEffect(() => {
        async function f() {
            setData(await fetchData(pb, props.tableColumn.id));
        }
        f();
    }, [props.tableColumn.id]);

    return (
        <div
            className={cn(
                "w-full rounded-lg shadow-sm ",
                "border border-slate-200",
                "flex flex-row overflow-hidden"
            )}
        >
            <div className={cn("flex flex-col border-r border-slate-200")}>
                <div className={cn("h-10 w-full bg-slate-900 px-4")}>asd</div>
                <div className={cn("w-full flex-grow bg-slate-100 p-4")}>
                    asd
                </div>
            </div>
            <div className="flex-grow bg-white"></div>
            {/*<div>{JSON.stringify(props.tableColumn, null, 2)}</div>*/}
            {/*<div>{JSON.stringify(data, null, 2)}</div>*/}
        </div>
    );
}
