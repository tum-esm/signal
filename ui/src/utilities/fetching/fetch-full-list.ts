export async function fetchFullList(
    collection: "signal_tables" | "signal_columns" | "signal_records",
    filter?: string
): Promise<any[]> {
    const response = await (
        await fetch(
            `https://esm-linode.dostuffthatmatters.dev/api/collections/${collection}/records?perPage=500` +
                (filter ? `&filter=${filter}` : ""),
            {
                next: {
                    revalidate: 500,
                },
                cache: "force-cache",
            }
        )
    ).json();

    const pageCount = response.totalPages;
    const results: any[] = response.items;

    for (let i = 2; i <= pageCount; i++) {
        const response = await (
            await fetch(
                `https://esm-linode.dostuffthatmatters.dev/api/collections/${collection}/records?perPage=500&page=${i}` +
                    (filter ? `&filter=${filter}` : ""),
                {
                    next: {
                        revalidate: 500,
                    },
                    cache: "force-cache",
                }
            )
        ).json();
        results.push(...response.items);
    }

    return results;
}
