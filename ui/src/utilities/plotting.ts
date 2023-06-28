import { CONSTANTS } from "./constants";
import * as d3 from "d3";
import { DataRecordType } from "./fetching/data";

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
    const xTicks: number[] = timeBinXTicks[720];
    const yTicks: number[] = timeBinYTicks[720];
    const xScale: (x: number) => number = timeBinXScale[720];
    const yScale: (x: number) => number = timeBinYScale[720];

    // VERICAL GRID LINES

    let xGridSelection: any = svg.select(`.x-grid-lines`);

    if (xGridSelection.empty()) {
        xGridSelection = svg.append("g").attr("class", `x-grid-lines`);
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

    let yGridSelection: any = svg.select(`.y-grid-lines`);

    if (yGridSelection.empty()) {
        yGridSelection = svg.append("g").attr("class", `y-grid-lines`);
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

    let frameSelection: any = svg.select(`.grid-frame`);
    if (frameSelection.empty()) {
        frameSelection = svg.append("g").attr("class", `grid-frame`);
    }

    const frameRectsSelection: any = frameSelection.selectAll("rect").data([1]);

    frameRectsSelection
        .enter()
        .append("rect")
        .merge(frameRectsSelection)
        .attr("x", CONSTANTS.PLOT.xMin)
        .attr("y", CONSTANTS.PLOT.yMin)
        .attr("width", CONSTANTS.PLOT.xMax - CONSTANTS.PLOT.xMin)
        .attr("height", CONSTANTS.PLOT.yMax - CONSTANTS.PLOT.yMin)
        .attr("fill", "none")
        .attr("stroke", "#1e293b")
        .attr("stroke-width", 0.5)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round");

    frameRectsSelection.exit().remove();
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
        let timeBinGroupSelection: any = svg.select(`.time-bin-${timeBin}`);
        if (timeBinGroupSelection.empty()) {
            timeBinGroupSelection = svg
                .append("g")
                .attr("class", `time-bin-${timeBin}`);
        }

        const xTicks: number[] = timeBinXTicks[timeBin];
        const yTicks: number[] = timeBinYTicks[timeBin];
        const xScale: (x: number) => number = timeBinXScale[timeBin];
        const yScale: (x: number) => number = timeBinYScale[timeBin];

        // X LABELS

        let xLabelsSelection: any = timeBinGroupSelection.select(`.x-labels`);

        if (xLabelsSelection.empty()) {
            xLabelsSelection = timeBinGroupSelection
                .append("g")
                .attr("class", `x-labels`);
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

        let yLabelsSelection: any = timeBinGroupSelection.select(`.y-labels`);

        if (yLabelsSelection.empty()) {
            yLabelsSelection = timeBinGroupSelection
                .append("g")
                .attr("class", `y-labels`);
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
            .text((value: number) => value.toPrecision(4));

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
        let timeBinGroupSelection: any = svg.select(`.time-bin-${timeBin}`);
        if (timeBinGroupSelection.empty()) {
            timeBinGroupSelection = svg
                .append("g")
                .attr("class", `time-bin-${timeBin}`);
        }

        const xScale: (x: number) => number = timeBinXScale[timeBin];
        const yScale: (x: number) => number = timeBinYScale[timeBin];

        let circleSize: number = 0;
        if (timeBin === 15) {
            circleSize = 1.2;
        } else if (timeBin === 60) {
            circleSize = 1.0;
        } else if (timeBin === 240) {
            circleSize = 0.8;
        } else {
            circleSize = 0.6;
        }

        sensorIds.forEach((sensorId: string, index: number) => {
            let dataSelection: any = timeBinGroupSelection.select(
                `.data-circles-sensor-${index + 1}`
            );

            if (dataSelection.empty()) {
                dataSelection = timeBinGroupSelection
                    .append("g")
                    .attr(
                        "class",
                        `data-circles-sensor-${index + 1} circle-color-sensor-${
                            index + 1
                        }`
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
                .attr("r", circleSize)
                .attr("fill", (r: DataRecordType) =>
                    xScale(r.timestamp) > CONSTANTS.PLOT.xMin
                        ? "currentColor"
                        : "none"
                );

            dataCirclesSelection.exit().remove();
        });
    });
}
