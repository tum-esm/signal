import { range } from "lodash";
import { CONSTANTS } from "./constants";
import * as d3 from "d3";

export function plotGrid(
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    xTicks: number[],
    yTicks: number[]
) {
    const xScale: (x: number) => number = d3
        .scaleLinear()
        .domain([xTicks[0], xTicks[xTicks.length - 1]])
        .range([CONSTANTS.PLOT.xMin, CONSTANTS.PLOT.xMax]);

    const yScale: (x: number) => number = d3
        .scaleLinear()
        .domain([yTicks[0], yTicks[yTicks.length - 1]])
        .range([CONSTANTS.PLOT.yMin, CONSTANTS.PLOT.yMax]);

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
        .attr("y", yScale(yTicks[0]))
        .attr("width", xScale(xTicks[xTicks.length - 1]) - xScale(xTicks[0]))
        .attr("height", yScale(yTicks[yTicks.length - 1]) - yScale(yTicks[0]))
        .attr("fill", "none")
        .attr("stroke", "#1e293b")
        .attr("stroke-width", 0.5)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round");

    frameRectsSelection.exit().remove();
}
