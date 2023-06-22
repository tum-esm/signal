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
        <div>
            <div>{JSON.stringify(props.tableColumn, null, 2)}</div>
            <div>{JSON.stringify(data, null, 2)}</div>
        </div>
    );
}
