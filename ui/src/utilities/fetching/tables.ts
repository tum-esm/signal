import { z } from "zod";
import PocketBase from "pocketbase";
import { fetchAuthToken } from "./auth";

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

export async function fetchTables(pb: PocketBase): Promise<TableRecordType[]> {
    const authToken = await fetchAuthToken();
    const response = await (
        await fetch(
            `https://esm-linode.dostuffthatmatters.dev/api/collections/signal_tables/records?perPage=256`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        )
    ).json();

    const pageCount = response.totalPages;
    const resultsList: TableRecordType[] = response.items.map((t: any) =>
        tableRecordSchema.parse(t)
    );
    return resultsList;
}
