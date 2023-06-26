import { z } from "zod";
import { TableColumnRecordType } from "./columns";
import { fetchFullList } from "./fetch-full-list";

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
    tableColumn: TableColumnRecordType
): Promise<DataRecordType[]> {
    const minDateString = new Date(Date.now() - 720 * 60 * 1000)
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);

    console.log(`start loading data for column ${tableColumn.columnName}}`);
    const resultList = await fetchFullList(
        "signal_records",
        `(signal_column="${tableColumn.id}")%26%26(created>="${minDateString}")`
    );
    console.log(`finished loading data for column ${tableColumn.columnName}}`);

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
