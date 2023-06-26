import { z } from "zod";
import { fetchFullList } from "./fetch-full-list";

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
        minimum: z.union([z.number(), z.null()]),
        maximum: z.union([z.number(), z.null()]),
        decimal_places: z.union([z.number(), z.null()]),
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
    collectionName: string,
    tableName: string
): Promise<TableColumnRecordType[]> {
    return (
        await fetchFullList(
            "signal_columns",
            `(table_name="${tableName}")%26%26(collection_name="${collectionName}")`
        )
    ).map((record) => tableColumnRecordSchema.parse(record));
}
