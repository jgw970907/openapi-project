import { fetchData } from "../functions/fetchData";

export function buttonClick(apiKey: string) {
  $("#searchBtn").on("click", async function () {
    const searchType = String($("#searchType").val());
    const query = String($("#searchInput").val());
    try {
      const data = await fetchData(1, query, searchType, apiKey);
      console.log("Fetched data:", data);
      return data;
    } catch (error) {
      console.error("Error in fetchData:", error);
    }
  });

  $("#searchInput").on("keypress", async function (e) {
    if (e.which === 13) {
      const searchType = String($("#searchType").val());
      const query = String($("#searchInput").val());
      try {
        const data = await fetchData(1, query, searchType, apiKey);
        console.log("Fetched data:", data);
        return data;
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    }
  });

  $("#resetBtn").on("click", async function () {
    $("#searchType").val("");
    $("#searchInput").val("");
    try {
      const data = await fetchData(1, "", "", apiKey);
      return data;
    } catch (error) {
      console.error("Error in fetchData:", error);
    }
  });
}
