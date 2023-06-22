import { z } from "zod";
import PocketBase from "pocketbase";

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
        // datetime looks like 2022-01-01 01:00:00.123Z
        date: parseInt(o.datetime.split(" ")[0].replace(/-/g, "")),
        hour:
            parseInt(o.datetime.substring(11, 13)) +
            (1 / 60) * parseInt(o.datetime.substring(14, 16)) +
            (1 / 3600) * parseInt(o.datetime.substring(17, 19)),
        value: o.value,
        sensor_id: o.sensor_id,
    }));

export type DataRecordType = z.infer<typeof dataRecordSchema>;

export async function fetchData(
    pb: PocketBase,
    columnId: string
): Promise<DataRecordType[]> {
    const minDateString = new Date(
        Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();
    const resultList = await pb.collection("signal_records").getFullList({
        filter:
            `(signal_column="${columnId}") && ` +
            `(created_at >= "${minDateString}")`,
    });
    return resultList.map((record) => dataRecordSchema.parse(record));
}
