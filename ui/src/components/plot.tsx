import { CONSTANTS } from "@/utilities/constants";
import { DataRecordType } from "@/utilities/fetching/fetch-data";
import { generateTicks } from "@/utilities/math";
import * as d3 from "d3";
import { max, min } from "lodash";
import { useEffect, useMemo, useRef } from "react";

export function Plot(props: { data: DataRecordType[]; sensorIds: string[] }) {
    const d3ContainerRef = useRef(null);

    const xTicks = useMemo(
        () =>
            generateTicks(
                props.data[0].timestamp,
                props.data[props.data.length - 1].timestamp,
                10
            ),
        props.data
    );
    const yTicks = useMemo(
        () =>
            generateTicks(
                min(props.data.map((d) => d.value)) || 0,
                max(props.data.map((d) => d.value)) || 0,
                10
            ),
        props.data
    );

    useEffect(() => {
        if (d3ContainerRef.current) {
            const svg = d3.select(d3ContainerRef.current);
        }
    }, [d3ContainerRef.current, props.data]);

    return (
        <div className="w-full p-4 bg-white">
            <svg
                className="relative z-0 rounded bg-slate-100 no-selection"
                ref={d3ContainerRef}
                viewBox={`0 0 ${CONSTANTS.PLOT.width} ${CONSTANTS.PLOT.height}`}
            />
        </div>
    );
}
