import { range } from "lodash";

export function generateTicks(
    minValue: number,
    maxValue: number,
    stepCount: number
): number[] {
    const step = (maxValue - minValue) / (stepCount - 1);
    return range(0, stepCount).map((i) => minValue + step * i);
}
