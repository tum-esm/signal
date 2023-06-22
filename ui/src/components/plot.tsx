import { CONSTANTS } from "@/utilities/constants";
import { DataRecordType } from "@/utilities/fetching/fetch-data";
import { generateTicks } from "@/utilities/math";
import { plotGrid, plotLabels } from "@/utilities/plotting";
import * as d3 from "d3";
import { max, min } from "lodash";
import { useEffect, useMemo, useRef } from "react";

export function Plot(props: { data: DataRecordType[]; sensorIds: string[] }) {
    const d3ContainerRef = useRef(null);

    const currentTimestamp = new Date().getTime();
    const xTicks = useMemo<number[]>(
        () =>
            props.data.length > 0
                ? generateTicks(
                      currentTimestamp - 24 * 60 * 60 * 1000,
                      currentTimestamp,
                      11
                  )
                : [],
        [props.data]
    );
    const yTicks = useMemo(() => {
        const minValue = min(props.data.map((d) => d.value));
        const maxValue = max(props.data.map((d) => d.value));
        if (minValue === undefined || maxValue === undefined) {
            return [];
        }
        const ySpan = maxValue - minValue;
        return generateTicks(minValue - 0.1 * ySpan, maxValue + 0.1 * ySpan, 9);
    }, [props.data]);

    const xScale: (x: number) => number = d3
        .scaleLinear()
        .domain([xTicks[0], xTicks[xTicks.length - 1]])
        .range([CONSTANTS.PLOT.xMin, CONSTANTS.PLOT.xMax]);

    const yScale: (x: number) => number = d3
        .scaleLinear()
        .domain([yTicks[yTicks.length - 1], yTicks[0]])
        .range([CONSTANTS.PLOT.yMin, CONSTANTS.PLOT.yMax]);

    useEffect(() => {
        if (d3ContainerRef.current) {
            const svg = d3.select(d3ContainerRef.current);
            plotGrid(svg, xTicks, yTicks, xScale, yScale);
            plotLabels(svg, xTicks, yTicks, xScale, yScale);
        }
    }, [d3ContainerRef.current, props.data, xTicks, yTicks]);

    return (
        <div className="w-full p-4 bg-white">
            <svg
                className="relative z-0 rounded bg-slate-50 no-selection"
                ref={d3ContainerRef}
                viewBox={`0 0 ${CONSTANTS.PLOT.width} ${CONSTANTS.PLOT.height}`}
            />
        </div>
    );
}
