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
import { fetchApiKey } from "../functions/fetchApiKey";
import ListDisplay from "./Display";
const apiUrl = "https://openapi.gg.go.kr/JobFndtnEduTraing";
const listDisplay = new ListDisplay();
export class Edu {
    constructor(currentPage, itemsPerPage) {
        this.listDisplay = new ListDisplay();
        this.apiKey = "";
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;
        this.listTotalCount = 0;
        this.responseData = null;
        this.fetchApiKeyAndData();
        $("#loadMoreBtn").on("click", () => {
            this.currentPage++;
            this.fetchMoreData(this.currentPage);
        });
    }
    fetchApiKeyAndData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKeyResponse = yield fetchApiKey("edu");
                this.apiKey = apiKeyResponse.apiKey;
                yield this.fetchInitialData();
            }
            catch (error) {
                listDisplay.displayError();
            }
        });
    }
    fetchInitialData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.fetchMoreData(this.currentPage); // 초기 데이터 요청
            }
            catch (error) {
                listDisplay.displayError(); // 오류 발생 시 에러 표시
            }
        });
    }
    fetchMoreData() {
        return __awaiter(this, arguments, void 0, function* (page = 1) {
            let params = {
                KEY: this.apiKey,
                Type: "json",
                pIndex: page,
                pSize: this.itemsPerPage,
            };
            $.ajax({
                url: apiUrl,
                type: "GET",
                data: params,
                dataType: "json",
                success: function (response) {
                    console.log("Daata fetched successfully", response);
                    this.responseData = response;
                    if (this.responseData &&
                        this.responseData.JobFndtnEduTraing &&
                        this.responseData.JobFndtnEduTraing.length > 0 &&
                        this.responseData.JobFndtnEduTraing[1].row) {
                        const trainData = response.JobFndtnEduTraing[1].row;
                        this.listTotalCount =
                            this.responseData.JobFndtnEduTraing[0].head[0].list_total_count;
                        this.displayTrain(trainData);
                        this.updateLoadMoreButton();
                        listDisplay.displayListTotalCnt(this.listTotalCount);
                    }
                    else {
                        console.error("No train data available or unexpected response");
                        this.displayNoResults();
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching data:", status, error);
                    listDisplay.displayError();
                },
            });
        });
    }
    displayTrain(trains) {
        trains.forEach(function (train) {
            const trainItem = `
      <li>
        <div class="first_row">
          <div>훈련명: ${train.PBLANC_TITLE}</div>
        </div>
        <div class="second_row">
          <div>훈련분야: ${train.DIV_NM}</div>
          <div>훈련형태: ${train.INST_NM}</div>
        </div>
        <div class="third_row">
          <div>훈련지역: ${train.REGION_NM}</div>
          <div>접수 시작일: ${train.RECRUT_BEGIN_DE}</div>
          <div>접수 종료일: ${train.RECRUT_END_DE}</div>
        </div>
        <div class="train_link">
          <a href="${train.DETAIL_PAGE_URL}" target="_blank">공고<br />보기</a>
        </div>
      </li>
        `;
            $(".train_list").append(trainItem);
        });
    }
    updateLoadMoreButton() {
        const totalPages = Math.ceil(this.listTotalCount / this.itemsPerPage);
        const remainingPages = totalPages - this.currentPage;
        if (remainingPages > 0) {
            $("#loadMoreBtn").text(`더보기 (${remainingPages}회 가능)`);
        }
        else {
            $("#loadMoreBtn").hide();
        }
    }
    displayNoResults() {
        $(".train_list").empty();
        const noResultsMessage = `
    <li>
      <div class="no_results">검색 결과가 없습니다.</div>
    </li>
  `;
        $(".train_list").append(noResultsMessage);
    }
}
//# sourceMappingURL=Edu.js.map
//# sourceMappingURL=Edu.js.map