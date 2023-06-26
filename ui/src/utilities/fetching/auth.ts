export async function fetchAuthToken(): Promise<string> {
    const response = await fetch(
        "https://esm-linode.dostuffthatmatters.dev/api/collections/users/auth-with-password",
        {
            next: {
                revalidate: 24 * 3600,
            },
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                identity: process.env.NEXT_PUBLIC_POCKETBASE_IDENTITY || "",
                password: process.env.NEXT_PUBLIC_POCKETBASE_PASSWORD || "",
            }),
        }
    );
    const token = (await response.json()).token;
    return token;
}
