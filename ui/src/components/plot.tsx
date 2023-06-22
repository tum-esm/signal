import { CONSTANTS } from "@/utilities/constants";
import { DataRecordType } from "@/utilities/fetching/fetch-data";
import { generateTicks } from "@/utilities/math";
import { plotGrid } from "@/utilities/plotting";
import * as d3 from "d3";
import { max, min } from "lodash";
import { useEffect, useMemo, useRef } from "react";

export function Plot(props: { data: DataRecordType[]; sensorIds: string[] }) {
    const d3ContainerRef = useRef(null);

    const xTicks = useMemo<number[]>(
        () =>
            props.data.length > 0
                ? generateTicks(
                      props.data[0].timestamp,
                      props.data[props.data.length - 1].timestamp,
                      11
                  )
                : [],
        [props.data]
    );
    const yTicks = useMemo(
        () =>
            props.data.length > 0
                ? generateTicks(
                      min(props.data.map((d) => d.value)) || 0,
                      max(props.data.map((d) => d.value)) || 0,
                      11
                  )
                : [],
        [props.data]
    );

    useEffect(() => {
        if (d3ContainerRef.current) {
            const svg = d3.select(d3ContainerRef.current);
            plotGrid(svg, xTicks, yTicks);
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
