import { z } from "zod";
import PocketBase from "pocketbase";

const tableColumnRecordSchema = z
    .object({
        collectionId: z.string(),
        collectionName: z.string(),
        id: z.string(),
        created: z.string(),
        updated: z.string(),
        column_name: z.string(),
        unit: z.string(),
        description: z.string(),
        minimum: z.number(),
        maximum: z.number(),
        decimal_places: z.number(),
    })
    .pick({
        id: true,
        column_name: true,
        unit: true,
        description: true,
        minimum: true,
        maximum: true,
        decimal_places: true,
    })
    .transform((o) => ({
        id: o.id,
        columnName: o.column_name,
        unit: o.unit,
        description: o.description,
        minimum: o.minimum,
        maximum: o.maximum,
        decimalPlaces: o.decimal_places,
    }));

export type TableColumnRecordType = z.infer<typeof tableColumnRecordSchema>;

export async function fetchTableColumns(
    pb: PocketBase,
    collectionName: string,
    tableName: string
): Promise<TableColumnRecordType[]> {
    const resultList = await pb.collection("signal_columns").getFullList({
        filter:
            `(table_name="${tableName}") && ` +
            `(collection_name="${collectionName}")`,
        $autoCancel: false,
    });
    return resultList.map((record) => tableColumnRecordSchema.parse(record));
}
