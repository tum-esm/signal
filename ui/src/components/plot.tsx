import { CONSTANTS } from "@/utilities/constants";
import { DataRecordType } from "@/utilities/fetching/fetch-data";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

export function Plot(props: { data: DataRecordType[]; sensorIds: string[] }) {
    const d3ContainerRef = useRef(null);

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
