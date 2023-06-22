import { z } from "zod";
import PocketBase from "pocketbase";

const tableRecordSchema = z
    .object({
        collectionId: z.string(),
        collectionName: z.string(),
        id: z.string(),
        created: z.string(),
        updated: z.string(),
        collection_name: z.string(),
        table_name: z.string(),
    })
    .pick({ collection_name: true, table_name: true })
    .transform((o) => ({
        collectionName: o.collection_name,
        tableName: o.table_name,
    }));

export type TableRecordType = z.infer<typeof tableRecordSchema>;

export async function fetchData(
    pb: PocketBase,
    columnId: string
): Promise<TableRecordType[]> {
    const resultList = await pb.collection("signal_tables").getFullList();
    return resultList.map((record) => tableRecordSchema.parse(record));
}
