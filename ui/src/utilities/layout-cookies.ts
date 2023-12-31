import { z } from "zod";

const layoutCookieElementSchema = z.object({
    collectionName: z.string(),
    tableName: z.string(),
    columns: z.array(
        z.object({
            name: z.string(),
            position: z.number(),
            hidden: z.boolean(),
        })
    ),
});

const layoutCookieSchema = z.array(layoutCookieElementSchema);
export type LayoutCookieElementType = z.infer<typeof layoutCookieElementSchema>;
export type LayoutCookieType = z.infer<typeof layoutCookieSchema>;

export function loadLayoutCookie(): LayoutCookieType {
    // TODO: implement loading
    return [];
}

export function dumpLayoutCookie(nc: LayoutCookieType) {
    // TODO: implement loading
}
