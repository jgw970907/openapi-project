var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// functions/fetchData.ts
export function fetchData() {
    return __awaiter(this, arguments, void 0, function* (page = 1, query = "", queryType = "", apiKey = "") {
        const params = {
            KEY: apiKey,
            Type: "json",
            pIndex: page,
            pSize: 5,
            ENTRPRS_NM: queryType === "enterprise" ? query : "",
            PBANC_CONT: queryType === "noticeName" ? query : "",
        };
        try {
            const response = yield $.ajax({
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
    });
}
//# sourceMappingURL=fetchData.js.map
//# sourceMappingURL=fetchData.js.map