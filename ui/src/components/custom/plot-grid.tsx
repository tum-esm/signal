import {
    LayoutCookieElementType,
    LayoutCookieType,
} from "@/utilities/layout-cookies";
import { PlotPanel } from "./plot-panel";
import { useEffect, useMemo, useState } from "react";
import {
    TableColumnRecordType,
    fetchTableColumns,
} from "@/utilities/fetch-table-columns";
import PocketBase from "pocketbase";
import { findIndex } from "lodash";
import { cn } from "@/utilities/class-names";

export function PlotGrid(props: {
    pb: PocketBase;
    layoutCookie: LayoutCookieType;
    collectionName: string;
    tableName: string;
    timeBin: 15 | 60 | 240 | 720;
    refreshPeriod: -1 | 10 | 30 | 60;
}) {
    const [columns, setColumns] = useState<TableColumnRecordType[] | undefined>(
        undefined
    );

    // when tableName changes, fetch columns
    useEffect(() => {
        const f = async () => {
            if (
                props.collectionName !== undefined &&
                props.tableName !== undefined
            ) {
                setColumns(
                    await fetchTableColumns(
                        props.pb,
                        props.collectionName,
                        props.tableName
                    )
                );
            }
        };
        f();
    }, [props.pb, props.collectionName, props.tableName]);

    const currentLayoutCookieElement: LayoutCookieElementType | undefined =
        useMemo(() => {
            const index = findIndex(
                props.layoutCookie,
                (lce) =>
                    lce.collectionName == props.collectionName &&
                    lce.tableName == props.tableName
            );
            if (index === -1) {
                return undefined;
            }
            return props.layoutCookie[index];
        }, [props.layoutCookie, props.collectionName, props.tableName]);

    if (columns === undefined) {
        return (
            <div className="mx-6 my-6 text-base font-semibold">
                Loading columns...
            </div>
        );
    }
    if (currentLayoutCookieElement === undefined) {
        return (
            <div className="mx-6 my-6 text-base font-semibold">
                Loading layout...
            </div>
        );
    }
    return (
        <div className={cn("grid grid-cols-1 4xl:grid-cols-2 gap-4")}>
            {columns.map((c) => (
                <PlotPanel
                    key={c.id}
                    tableColumn={c}
                    timeBin={props.timeBin}
                    refreshPeriod={props.refreshPeriod}
                />
            ))}
        </div>
    );
}
