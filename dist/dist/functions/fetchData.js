// functions/fetchData.ts
export async function fetchData(page = 1, sizePerPage = 10, query = "", queryType = "", apiKey = "") {
    const params = {
        KEY: apiKey,
        Type: "json",
        pIndex: page,
        pSize: sizePerPage,
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
    }
    catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
//# sourceMappingURL=fetchData.js.map
//# sourceMappingURL=fetchData.js.map