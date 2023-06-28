import { cn } from "@/utilities/class-names";
import { CONSTANTS } from "@/utilities/constants";
import { DataRecordType } from "@/utilities/fetching/data";
import { generateTicks } from "@/utilities/math";
import { plotData, plotGrid, plotLabels } from "@/utilities/plotting";
import * as d3 from "d3";
import { concat, max, mean, min, range } from "lodash";
import { use, useEffect, useMemo, useRef, useState } from "react";

function smoothData(
    data: DataRecordType[],
    timeBin: 15 | 60 | 240 | 720,
    sensorIds: string[],
    currentTimestamp: number
) {
    if (data.length === 0 || timeBin === 15 || timeBin === 60) {
        return data;
    }
    const intervalLength = timeBin === 240 ? 1 : 1;
    const lastTimestamp = Math.floor(currentTimestamp / 60000) * 60000;
    const timestamps = range(
        lastTimestamp - timeBin * 60000,
        lastTimestamp,
        intervalLength * 60000
    );
    return concat(
        ...sensorIds.map((sensorId) => {
            const dataFilteredBySensor = data.filter(
                (d) => d.sensorId === sensorId
            );
            return timestamps
                .map((timestamp) => ({
                    timestamp: timestamp + intervalLength * 30000,
                    value: mean(
                        dataFilteredBySensor
                            .filter(
                                (d) =>
                                    d.timestamp >= timestamp &&
                                    d.timestamp <
                                        timestamp + intervalLength * 60000
                            )
                            .map((d) => d.value)
                    ),
                    sensorId: sensorId,
                }))
                .filter((d) => !isNaN(d.value));
        })
    );
}

export function Plot(props: {
    allData: DataRecordType[];
    sensorIds: string[];
    timeBin: 15 | 60 | 240 | 720;
}) {
    const d3ContainerRef = useRef(null);
    const currentTimestamp = new Date().getTime();
    console.log(`Plot render ${new Date().getTime()}`);

    const [loadingState, setLoadingState] = useState<
        "loading" | "parsing" | "plotting" | "ready"
    >("loading");
    useEffect(() => {
        if (props.allData.length > 0) {
            setLoadingState("parsing");
        }
    }, [props.allData]);

    const timeBinData: {
        [key in 15 | 60 | 240 | 720]: DataRecordType[];
    } = useMemo(() => {
        function f(timeBin: 15 | 60 | 240 | 720) {
            /*return smoothData(
                props.allData.filter(
                    (d) => d.timestamp >= currentTimestamp - timeBin * 60000
                ),
                timeBin,
                props.sensorIds,
                currentTimestamp
            );*/
            return props.allData.filter(
                (d) => d.timestamp >= currentTimestamp - timeBin * 60000
            );
        }
        return { 15: f(15), 60: f(60), 240: f(240), 720: f(720) };
    }, [props.allData, currentTimestamp, props.sensorIds]);

    const timeBinXTicks: {
        [key in 15 | 60 | 240 | 720]: number[];
    } = useMemo(() => {
        function f(timeBin: 15 | 60 | 240 | 720) {
            return generateTicks(
                currentTimestamp - timeBin * 60000,
                currentTimestamp,
                11
            );
        }
        return { 15: f(15), 60: f(60), 240: f(240), 720: f(720) };
    }, [currentTimestamp]);

    const timeBinYTicks: {
        [key in 15 | 60 | 240 | 720]: number[];
    } = useMemo(() => {
        function f(timeBin: 15 | 60 | 240 | 720) {
            const minValue = min(timeBinData[timeBin].map((d) => d.value));
            const maxValue = max(timeBinData[timeBin].map((d) => d.value));
            if (minValue === undefined || maxValue === undefined) {
                return [];
            }
            const ySpan = maxValue - minValue;
            return generateTicks(
                minValue - 0.1 * ySpan,
                maxValue + 0.1 * ySpan,
                9
            );
        }

        return { 15: f(15), 60: f(60), 240: f(240), 720: f(720) };
    }, [timeBinData]);

    const timeBinXScale: {
        [key in 15 | 60 | 240 | 720]: (x: number) => number;
    } = useMemo(() => {
        function f(timeBin: 15 | 60 | 240 | 720) {
            return d3
                .scaleLinear()
                .domain([
                    timeBinXTicks[timeBin][0],
                    timeBinXTicks[timeBin][timeBinXTicks[timeBin].length - 1],
                ])
                .range([CONSTANTS.PLOT.xMin, CONSTANTS.PLOT.xMax]);
        }
        return { 15: f(15), 60: f(60), 240: f(240), 720: f(720) };
    }, [timeBinXTicks]);

    const timeBinYScale: {
        [key in 15 | 60 | 240 | 720]: (x: number) => number;
    } = useMemo(() => {
        function f(timeBin: 15 | 60 | 240 | 720) {
            return d3
                .scaleLinear()
                .domain([
                    timeBinYTicks[timeBin][timeBinYTicks[timeBin].length - 1],
                    timeBinYTicks[timeBin][0],
                ])
                .range([CONSTANTS.PLOT.yMin, CONSTANTS.PLOT.yMax]);
        }
        return { 15: f(15), 60: f(60), 240: f(240), 720: f(720) };
    }, [timeBinYTicks]);

    useEffect(() => {
        if (
            d3ContainerRef.current &&
            (loadingState === "parsing" || loadingState === "ready")
        ) {
            if (loadingState === "parsing") {
                setLoadingState("plotting");
            }
            const svg = d3.select(d3ContainerRef.current);
            plotGrid(
                svg,
                timeBinXTicks,
                timeBinYTicks,
                timeBinXScale,
                timeBinYScale
            );
            plotLabels(
                svg,
                timeBinXTicks,
                timeBinYTicks,
                timeBinXScale,
                timeBinYScale
            );
            plotData(
                svg,
                timeBinData,
                timeBinXScale,
                timeBinYScale,
                props.sensorIds
            );
            setLoadingState("ready");
        }
    }, [
        d3ContainerRef,
        timeBinData,
        timeBinXTicks,
        timeBinYTicks,
        timeBinXScale,
        timeBinYScale,
        props.sensorIds,
    ]);
    return (
        <div
            className={cn(
                "w-full p-4 bg-white relative",
                props.timeBin !== 15 ? "time-bin-15-hidden" : "",
                props.timeBin !== 60 ? "time-bin-60-hidden" : "",
                props.timeBin !== 240 ? "time-bin-240-hidden" : "",
                props.timeBin !== 720 ? "time-bin-720-hidden" : ""
            )}
        >
            {loadingState !== "ready" && (
                <div
                    className={cn(
                        "absolute z-50 text-sm rounded-sm px-1 py-0.5",
                        "top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2",
                        "bg-slate-900 text-slate-100"
                    )}
                >
                    {loadingState}
                </div>
            )}
            <svg
                className="relative z-0 rounded no-selection"
                ref={d3ContainerRef}
                viewBox={`0 0 ${CONSTANTS.PLOT.width} ${CONSTANTS.PLOT.height}`}
            />
        </div>
    );
}
