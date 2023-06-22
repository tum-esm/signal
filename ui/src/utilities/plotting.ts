import { range } from "lodash";
import { CONSTANTS } from "./constants";
import * as d3 from "d3";

export function plotGrid(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    xTicks: number[],
    yTicks: number[],
    xScale: (x: number) => number,
    yScale: (x: number) => number
) {
    // VERICAL GRID LINES

    let xGridSelection: any = svg.select(".x-grid-lines");

    if (xGridSelection.empty()) {
        xGridSelection = svg.append("g").attr("class", "x-grid-lines");
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

    let yGridSelection: any = svg.select(".y-grid-lines");

    if (yGridSelection.empty()) {
        yGridSelection = svg.append("g").attr("class", "y-grid-lines");
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

    let frameSelection: any = svg.select(".grid-frame");
    if (frameSelection.empty()) {
        frameSelection = svg.append("g").attr("class", "grid-frame");
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
}

export function plotLabels(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    xTicks: number[],
    yTicks: number[],
    xScale: (x: number) => number,
    yScale: (x: number) => number
) {
    // X LABELS

    let xLabelsSelection: any = svg.select(".x-labels");

    if (xLabelsSelection.empty()) {
        xLabelsSelection = svg.append("g").attr("class", "x-labels");
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

    let yLabelsSelection: any = svg.select(".y-labels");

    if (yLabelsSelection.empty()) {
        yLabelsSelection = svg.append("g").attr("class", "y-labels");
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
