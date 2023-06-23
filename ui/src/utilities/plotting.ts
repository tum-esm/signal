import { range } from "lodash";
import { CONSTANTS } from "./constants";
import * as d3 from "d3";
import { DataRecordType } from "./fetching/fetch-data";

const timeBins: (15 | 60 | 240 | 720)[] = [15, 60, 240, 720];

export function plotGrid(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    timeBinXTicks: {
        [key in 15 | 60 | 240 | 720]: number[];
    },
    timeBinYTicks: {
        [key in 15 | 60 | 240 | 720]: number[];
    },
    timeBinXScale: {
        [key in 15 | 60 | 240 | 720]: (x: number) => number;
    },
    timeBinYScale: {
        [key in 15 | 60 | 240 | 720]: (x: number) => number;
    }
) {
    timeBins.forEach((timeBin) => {
        const xTicks: number[] = timeBinXTicks[timeBin];
        const yTicks: number[] = timeBinYTicks[timeBin];
        const xScale: (x: number) => number = timeBinXScale[timeBin];
        const yScale: (x: number) => number = timeBinYScale[timeBin];

        // VERICAL GRID LINES

        let xGridSelection: any = svg.select(`.x-grid-lines-${timeBin}`);

        if (xGridSelection.empty()) {
            xGridSelection = svg
                .append("g")
                .attr("class", `x-grid-lines-${timeBin}`);
        }

        const xGridLinesLinesSelection: any = xGridSelection
            .selectAll("line")
            .data(xTicks.slice(1, xTicks.length - 1));

        xGridLinesLinesSelection
            .enter()
            .append("line")
            .merge(xGridLinesLinesSelection)
            .attr("x1", (value: number) => xScale(value))
            .attr("x2", (value: number) => xScale(value))
            .attr("y1", CONSTANTS.PLOT.yMin)
            .attr("y2", CONSTANTS.PLOT.yMax)
            .attr("stroke", "#cbd5e1")
            .attr("stroke-width", 0.5)
            .attr("stroke-linecap", "butt");

        xGridLinesLinesSelection.exit().remove();

        // HORIZONTAL GRID LINES

        let yGridSelection: any = svg.select(`.y-grid-lines-${timeBin}`);

        if (yGridSelection.empty()) {
            yGridSelection = svg
                .append("g")
                .attr("class", `y-grid-lines-${timeBin}`);
        }

        const yGridLinesLinesSelection: any = yGridSelection
            .selectAll("line")
            .data(yTicks.slice(1, yTicks.length - 1));

        yGridLinesLinesSelection
            .enter()
            .append("line")
            .merge(yGridLinesLinesSelection)
            .attr("x1", CONSTANTS.PLOT.xMin)
            .attr("x2", CONSTANTS.PLOT.xMax)
            .attr("y1", (value: number) => yScale(value))
            .attr("y2", (value: number) => yScale(value))
            .attr("stroke", "#cbd5e1")
            .attr("stroke-width", 0.5)
            .attr("stroke-linecap", "butt");

        // GRID FRAME

        let frameSelection: any = svg.select(`.grid-frame-${timeBin}`);
        if (frameSelection.empty()) {
            frameSelection = svg
                .append("g")
                .attr("class", `grid-frame-${timeBin}`);
        }

        const frameRectsSelection: any = yGridSelection
            .selectAll("rect")
            .data(range(1, yTicks.length - 1));

        frameRectsSelection
            .enter()
            .append("rect")
            .merge(frameRectsSelection)
            .attr("x", xScale(xTicks[0]))
            .attr("y", yScale(yTicks[yTicks.length - 1]))
            .attr("width", CONSTANTS.PLOT.xMax - CONSTANTS.PLOT.xMin)
            .attr("height", CONSTANTS.PLOT.yMax - CONSTANTS.PLOT.yMin)
            .attr("fill", "none")
            .attr("stroke", "#1e293b")
            .attr("stroke-width", 0.5)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round");

        frameRectsSelection.exit().remove();
    });
}

export function plotLabels(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    timeBinXTicks: {
        [key in 15 | 60 | 240 | 720]: number[];
    },
    timeBinYTicks: {
        [key in 15 | 60 | 240 | 720]: number[];
    },
    timeBinXScale: {
        [key in 15 | 60 | 240 | 720]: (x: number) => number;
    },
    timeBinYScale: {
        [key in 15 | 60 | 240 | 720]: (x: number) => number;
    }
) {
    timeBins.forEach((timeBin) => {
        const xTicks: number[] = timeBinXTicks[timeBin];
        const yTicks: number[] = timeBinYTicks[timeBin];
        const xScale: (x: number) => number = timeBinXScale[timeBin];
        const yScale: (x: number) => number = timeBinYScale[timeBin];

        // X LABELS

        let xLabelsSelection: any = svg.select(`.x-labels-${timeBin}`);

        if (xLabelsSelection.empty()) {
            xLabelsSelection = svg
                .append("g")
                .attr("class", `x-labels-${timeBin}`);
        }

        const xLabelsTextSelection: any = xLabelsSelection
            .selectAll("text")
            .data(xTicks);

        xLabelsTextSelection
            .enter()
            .append("text")
            .merge(xLabelsTextSelection)
            .attr("x", (value: number) => xScale(value))
            .attr("y", CONSTANTS.PLOT.yMax + 3)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "hanging")
            .attr("font-size", 6)
            .attr("fill", "#1e293b")
            // the value is a unix timestamp, only the local time is interesting
            .text((value: number) => new Date(value).toLocaleTimeString());

        xLabelsTextSelection.exit().remove();

        // Y LABELS

        let yLabelsSelection: any = svg.select(`.y-labels-${timeBin}`);

        if (yLabelsSelection.empty()) {
            yLabelsSelection = svg
                .append("g")
                .attr("class", `y-labels-${timeBin}`);
        }

        const yLabelsTextSelection: any = yLabelsSelection
            .selectAll("text")
            .data(yTicks.slice(1, yTicks.length - 1));

        yLabelsTextSelection
            .enter()
            .append("text")
            .merge(yLabelsTextSelection)
            .attr("x", CONSTANTS.PLOT.xMin - 3)
            .attr("y", (value: number) => yScale(value))
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "middle")
            .attr("fill", "#1e293b")
            .attr("font-size", 6)
            .text((value: number) => value.toPrecision(3));

        yLabelsTextSelection.exit().remove();
    });

    // X AXIS TITLE

    let xAxisTitleSelection: any = svg.select(".x-axis-title");

    if (xAxisTitleSelection.empty()) {
        xAxisTitleSelection = svg.append("g").attr("class", "x-axis-title");
    }

    const xAxisTitleTextSelection: any = xAxisTitleSelection
        .selectAll("text")
        .data([1]);

    xAxisTitleTextSelection
        .enter()
        .append("text")
        .merge(xAxisTitleTextSelection)
        .attr(
            "x",
            CONSTANTS.PLOT.xMin +
                (CONSTANTS.PLOT.xMax - CONSTANTS.PLOT.xMin) / 2
        )
        .attr("y", CONSTANTS.PLOT.yMax + 12)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "hanging")
        .attr("fill", "#1e293b")
        .attr("font-size", 6)
        .attr("font-weight", 600)
        .text("Local Time");
}

export function plotData(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    timeBinData: {
        [key in 15 | 60 | 240 | 720]: DataRecordType[];
    },
    timeBinXScale: {
        [key in 15 | 60 | 240 | 720]: (x: number) => number;
    },
    timeBinYScale: {
        [key in 15 | 60 | 240 | 720]: (x: number) => number;
    },
    sensorIds: string[]
) {
    timeBins.forEach((timeBin) => {
        const xScale: (x: number) => number = timeBinXScale[timeBin];
        const yScale: (x: number) => number = timeBinYScale[timeBin];

        sensorIds.forEach((sensorId: string) => {
            let dataSelection: any = svg.select(
                `.data-circles-${sensorId}-${timeBin}`
            );

            if (dataSelection.empty()) {
                dataSelection = svg
                    .append("g")
                    .attr(
                        "class",
                        `data-circles-${sensorId}-${timeBin} text-red-500`
                    );
            }

            const dataCirclesSelection: any = dataSelection
                .selectAll("circle")
                .data(
                    timeBinData[timeBin].filter(
                        (r: DataRecordType) => r.sensorId === sensorId
                    )
                );

            dataCirclesSelection
                .enter()
                .append("circle")
                .merge(dataCirclesSelection)
                .attr("cx", (r: DataRecordType) => xScale(r.timestamp))
                .attr("cy", (r: DataRecordType) => yScale(r.value))
                .attr("r", 0.5)
                .attr("fill", "currentColor");

            dataCirclesSelection.exit().remove();
        });
    });
}
