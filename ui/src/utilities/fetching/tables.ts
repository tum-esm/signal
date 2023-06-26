import { z } from "zod";
import { fetchFullList } from "./fetch-full-list";

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

export async function fetchTables(): Promise<TableRecordType[]> {
    const resultsList: TableRecordType[] = (
        await fetchFullList("signal_tables")
    ).map((t: any) => tableRecordSchema.parse(t));
    return resultsList;
}
