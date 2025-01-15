export async function fetchApiKey(
  apiname: string
): Promise<{ apiKey: string }> {
  try {
    const response = await fetch(`./netlify/functions/get-api-${apiname}`);
    if (!response.ok) {
      throw new Error("Failed to fetch API key");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching API key", error);
    throw error;
  }
}
