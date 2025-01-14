export async function fetchApiKey(apiname) {
    try {
        const response = await fetch(`/src/netlify/functions/get-api-${apiname}`);
        if (!response.ok) {
            throw new Error("Failed to fetch API key");
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching API key", error);
        throw error;
    }
}
//# sourceMappingURL=fetchApiKey.js.map
//# sourceMappingURL=fetchApiKey.js.map