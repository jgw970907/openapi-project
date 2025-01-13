// functions/fetchData.ts
export async function fetchData(
  page: number = 1,
  query: string = "",
  queryType: string = "",
  apiKey: string = ""
) {
  const params = {
    KEY: apiKey,
    Type: "json",
    pIndex: page,
    pSize: 5,
    ENTRPRS_NM: queryType === "enterprise" ? query : "",
    PBANC_CONT: queryType === "noticeName" ? query : "",
  };

  try {
    const response = await $.ajax({
      url: "https://openapi.gg.go.kr/GGJOBABARECRUSTM",
      type: "GET",
      data: params,
      dataType: "json",
      cache: false,
    });
    console.log("Data fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
