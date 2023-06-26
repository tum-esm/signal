import { cn } from "@/utilities/class-names";
import { DataRecordType, fetchData } from "@/utilities/fetching/data";
import { TableColumnRecordType } from "@/utilities/fetching/columns";
import PocketBase from "pocketbase";
import { useEffect, useMemo, useState } from "react";
import { min, mean, sortedUniq, max } from "lodash";
import { Plot } from "./plot";

export function PlotPanel(props: {
    tableColumn: TableColumnRecordType;
    timeBin: 15 | 60 | 240 | 720;
    refreshPeriod: -1 | 10 | 30 | 60;
}) {
    const [allData, setAllData] = useState<DataRecordType[]>([]);
    const [timedData, setTimedData] = useState<DataRecordType[]>([]);
    const [refreshIsRunning, setRefreshIsRunning] = useState(false);

    const pb = useMemo(
        () => new PocketBase("https://esm-linode.dostuffthatmatters.dev"),
        []
    );

    const sensorIds = useMemo(() => {
        return timedData
            ? sortedUniq(timedData.map((d) => d.sensorId).sort())
            : [];
    }, [timedData]);

    const sensorIdMetricValues: {
        [sensorId: string]: {
            min: number | undefined;
            current: number | undefined;
            max: number | undefined;
        };
    } = useMemo(() => {
        return sensorIds.reduce((acc, sensorId) => {
            const values = timedData
                ? timedData
                      .filter((d) => d.sensorId === sensorId)
                      .map((d) => d.value)
                : [];
            return {
                ...acc,
                [sensorId]: {
                    min: min(values),
                    current: values[values.length - 1],
                    max: max(values),
                },
            };
        }, {});
    }, [timedData, sensorIds]);

    useEffect(() => {
        async function f() {
            setRefreshIsRunning(true);
            setAllData(await fetchData(pb, props.tableColumn));
            setRefreshIsRunning(false);
        }
        f();
        if (props.refreshPeriod !== -1) {
            const interval = setInterval(f, props.refreshPeriod * 1000);
            return () => clearInterval(interval);
        }
    }, [props.tableColumn, props.refreshPeriod, pb]);

    useEffect(() => {
        const startTimestamp = new Date(
            new Date().getTime() - props.timeBin * 60000
        ).getTime();
        setTimedData(allData.filter((d) => d.timestamp >= startTimestamp));
    }, [props.timeBin, allData]);

    return (
        <div
            className={cn(
                "w-full rounded-lg shadow-sm",
                "border border-slate-200",
                "flex flex-row overflow-hidden"
            )}
        >
            <div
                className={cn(
                    "flex flex-col border-r border-slate-200",
                    "w-[22rem] min-h-[16rem] flex-shrink-0"
                )}
            >
                <h2
                    className={cn(
                        "flex flex-col px-4 py-2 bg-slate-800",
                        "gap-y-1 relative"
                    )}
                >
                    <span className="text-xl whitespace-nowrap">
                        <span className="mr-1 font-bold text-slate-50">
                            {props.tableColumn.columnName}
                        </span>
                        <span className="text-slate-100">
                            [{props.tableColumn.unit}]
                        </span>
                    </span>
                    {props.tableColumn.description.length > 0 && (
                        <p className="text-sm font-normal text-slate-200">
                            {props.tableColumn.description}
                        </p>
                    )}
                    <div
                        className={cn(
                            "absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full",
                            refreshIsRunning
                                ? "animate-pulse bg-slate-200"
                                : "bg-slate-600"
                        )}
                    />
                </h2>
                <div
                    className={cn(
                        "h-10 w-full bg-slate-900 px-4 flex items-center",
                        "border-y border-slate-600"
                    )}
                >
                    <div
                        className={cn(
                            "grid grid-cols-5 text-sm text-center text-slate-100 w-full"
                        )}
                    >
                        <div
                            className={cn(
                                "font-semibold col-span-2 text-left w-full pl-[1.25rem]"
                            )}
                        >
                            sensor id
                        </div>
                        <div>min</div>
                        <div>current</div>

                        <div>max</div>
                    </div>
                </div>
                <div
                    className={cn(
                        "w-full flex-grow bg-slate-100 p-4",
                        "flex flex-col gap-y-2"
                    )}
                >
                    {sensorIds.map((sensorId, index) => (
                        <div
                            className={cn(
                                "grid grid-cols-5 text-sm text-center"
                            )}
                            key={sensorId}
                        >
                            <div
                                className={cn(
                                    "col-span-2 font-semibold flex flex-row ",
                                    "items-center justify-start w-full"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-3 h-3 rounded",
                                        `bg-color-sensor-${index + 1}`
                                    )}
                                />
                                <div
                                    className={cn(
                                        "ml-2",
                                        `text-color-sensor-${index + 1}`
                                    )}
                                >
                                    {sensorId.toUpperCase()}
                                </div>
                            </div>

                            <div className={cn("col-span-1")}>
                                {sensorIdMetricValues[
                                    sensorId
                                ].min?.toPrecision(4)}
                            </div>
                            <div className={cn("col-span-1")}>
                                {sensorIdMetricValues[
                                    sensorId
                                ].current?.toPrecision(4)}
                            </div>
                            <div className={cn("col-span-1")}>
                                {sensorIdMetricValues[
                                    sensorId
                                ].max?.toPrecision(4)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col flex-grow bg-white">
                <Plot
                    allData={allData}
                    sensorIds={sensorIds}
                    timeBin={props.timeBin}
                />
            </div>
        </div>
    );
}
