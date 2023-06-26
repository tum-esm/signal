import {
    LayoutCookieElementType,
    LayoutCookieType,
} from "@/utilities/layout-cookies";
import { PlotPanel } from "./plot-panel";
import { useEffect, useState } from "react";
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
    const [layout, setLayout] = useState<LayoutCookieElementType | undefined>(
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

    useEffect(() => {
        if (columns !== undefined) {
            const index = findIndex(
                props.layoutCookie,
                (lce) =>
                    lce.collectionName == props.collectionName &&
                    lce.tableName == props.tableName
            );
            if (index !== -1) {
                const newLayout = props.layoutCookie[index];
                if (
                    newLayout.columns.map((c) => c.name).sort() ===
                    columns.map((c) => c.columnName).sort()
                ) {
                    setLayout(newLayout);
                    return;
                }
                console.log("Column names have changed, resetting layout.");
            }
            // set default layout
            setLayout({
                collectionName: props.collectionName,
                tableName: props.tableName,
                columns: columns
                    .sort((c1, c2) => (c1.columnName > c2.columnName ? 1 : -1))
                    .map((c, i) => ({
                        name: c.columnName,
                        position: i,
                        hidden: false,
                    })),
            });
        }
    }, [props.layoutCookie, props.collectionName, props.tableName, columns]);

    if (columns === undefined) {
        return (
            <div className="mx-6 my-6 text-base font-semibold">
                Loading columns...
            </div>
        );
    }

    if (layout === undefined) {
        return (
            <div className="mx-6 my-6 text-base font-semibold">
                Loading layout...
            </div>
        );
    }

    const renderedColumns: TableColumnRecordType[] = [];
    layout.columns
        .sort((c1, c2) => c1.position - c2.position)
        .filter((c) => !c.hidden)
        .forEach((c) => {
            const index = findIndex(
                columns,
                (col) => col.columnName === c.name
            );
            renderedColumns.push(columns[index]);
        });

    return (
        <div className={cn("grid grid-cols-1 4xl:grid-cols-2 gap-4")}>
            {renderedColumns.map((c) => (
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
