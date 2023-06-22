import { cn } from "@/lib/utils";
import { DataRecordType, fetchData } from "@/utilities/fetching/fetch-data";
import { TableColumnRecordType } from "@/utilities/fetching/fetch-table-columns";
import PocketBase from "pocketbase";
import { useEffect, useMemo, useState } from "react";
import { min, mean, uniq } from "lodash";

export function PlotPanel(props: { tableColumn: TableColumnRecordType }) {
    const [data, setData] = useState<DataRecordType[]>([]);
    const pb = new PocketBase("https://esm-linode.dostuffthatmatters.dev");

    const sensorIds = data ? uniq(data.map((d) => d.sensorId)) : [];

    const sensorIdMetricValues: {
        [sensorId: string]: {
            current: number | undefined;
            min: number | undefined;
            avg: number | undefined;
            max: number | undefined;
        };
    } = useMemo(() => {
        return sensorIds.reduce((acc, sensorId) => {
            const values = data
                ? data
                      .filter((d) => d.sensorId === sensorId)
                      .map((d) => d.value)
                : [];
            return {
                ...acc,
                [sensorId]: {
                    current: values[values.length - 1]?.toPrecision(4),
                    min: min(values)?.toPrecision(4),
                    avg: mean(values)?.toPrecision(4),
                    max: min(values)?.toPrecision(4),
                },
            };
        }, {});
    }, [data]);

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
            <div
                className={cn(
                    "flex flex-col border-r border-slate-200",
                    "w-[24rem] h-[20rem] flex-shrink-0"
                )}
            >
                <div
                    className={cn(
                        "h-10 w-full bg-slate-900 px-4 flex items-center"
                    )}
                >
                    <div
                        className={cn(
                            "grid grid-cols-6 text-sm text-center text-slate-200 w-full"
                        )}
                    >
                        <div className={cn("font-semibold col-span-2")}>
                            sensor id
                        </div>
                        <div>current</div>
                        <div>min</div>
                        <div>avg</div>
                        <div>max</div>
                    </div>
                </div>
                <div className={cn("w-full flex-grow bg-slate-100 p-4")}>
                    {sensorIds.map((sensorId) => (
                        <div
                            className={cn(
                                "grid grid-cols-6 text-sm text-center"
                            )}
                        >
                            <div className={cn("col-span-2 font-semibold")}>
                                {sensorId}
                            </div>
                            <div className={cn("col-span-1")}>
                                {sensorIdMetricValues[sensorId].current}
                            </div>
                            <div className={cn("col-span-1")}>
                                {sensorIdMetricValues[sensorId].min}
                            </div>
                            <div className={cn("col-span-1")}>
                                {sensorIdMetricValues[sensorId].avg}
                            </div>
                            <div className={cn("col-span-1")}>
                                {sensorIdMetricValues[sensorId].max}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col flex-grow bg-white">
                <h2 className="flex items-baseline h-10 p-2">
                    <span className="mr-1 text-lg whitespace-nowrap">
                        <span className="mr-1 font-bold">
                            {props.tableColumn.columnName}
                        </span>
                        [{props.tableColumn.unit}]
                    </span>
                    <p className="px-2 text-sm font-normal">
                        {props.tableColumn.description}
                    </p>
                </h2>
            </div>
            {/*<div>{JSON.stringify(props.tableColumn, null, 2)}</div>*/}
            {/*<div>{JSON.stringify(data, null, 2)}</div>*/}
        </div>
    );
}
