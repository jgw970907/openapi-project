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
import { fetchData } from "../functions/fetchData";
export function buttonClick(apiKey) {
    $("#searchBtn").on("click", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const searchType = String($("#searchType").val());
            const query = String($("#searchInput").val());
            try {
                const data = yield fetchData(1, query, searchType, apiKey);
                console.log("Fetched data:", data);
                return data;
            }
            catch (error) {
                console.error("Error in fetchData:", error);
            }
        });
    });
    $("#searchInput").on("keypress", function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.which === 13) {
                const searchType = String($("#searchType").val());
                const query = String($("#searchInput").val());
                try {
                    const data = yield fetchData(1, query, searchType, apiKey);
                    console.log("Fetched data:", data);
                    return data;
                }
                catch (error) {
                    console.error("Error in fetchData:", error);
                }
            }
        });
    });
    $("#resetBtn").on("click", function () {
        return __awaiter(this, void 0, void 0, function* () {
            $("#searchType").val("");
            $("#searchInput").val("");
            try {
                const data = yield fetchData(1, "", "", apiKey);
                return data;
            }
            catch (error) {
                console.error("Error in fetchData:", error);
            }
        });
    });
}
//# sourceMappingURL=buttonClick.js.map
//# sourceMappingURL=buttonClick.js.map