import { z } from "zod";
import { TableColumnRecordType } from "./columns";
import { fetchFullList } from "./fetch-full-list";
import { max } from "lodash";

const dataRecordSchema = z
    .object({
        collectionId: z.string(),
        collectionName: z.string(),
        id: z.string(),
        created: z.string(),
        updated: z.string(),
        signal_column: z.string(),
        sensor_id: z.string(),
        datetime: z.string(),
        value: z.number(),
    })
    .pick({ sensor_id: true, datetime: true, value: true })
    .transform((o) => ({
        timestamp: new Date(o.datetime).getTime(),
        value: o.value,
        sensorId: o.sensor_id,
    }));

export type DataRecordType = z.infer<typeof dataRecordSchema>;

export async function fetchData(
    tableColumn: TableColumnRecordType,
    latestDataTimestamp: number
): Promise<DataRecordType[]> {
    const earliestPlotTimeStamp = new Date().getTime() - 720 * 60 * 1000;
    const minDateString = new Date(
        latestDataTimestamp > earliestPlotTimeStamp
            ? latestDataTimestamp
            : earliestPlotTimeStamp
    )
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);

    console.log(
        `fetching column ${tableColumn.columnName}} from ` +
            `${minDateString}: start`
    );
    const resultList = await fetchFullList(
        "signal_records",
        `(signal_column="${tableColumn.id}")%26%26(datetime>="${minDateString}")`
    );
    console.log(
        `fetching column ${tableColumn.columnName}} from ` +
            `${minDateString}: done, ${resultList.length} new item(s)`
    );

    return resultList
        .map((record) => dataRecordSchema.parse(record))
        .filter(
            (d) =>
                (tableColumn.minimum !== null
                    ? d.value >= tableColumn.minimum
                    : true) &&
                (tableColumn.maximum !== null
                    ? d.value <= tableColumn.maximum
                    : true)
        );
}
