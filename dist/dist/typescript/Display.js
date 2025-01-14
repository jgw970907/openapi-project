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
import { fetchData } from "../functions/fetchData";
const itemsPerPage = 5;
let apiKey = "";
class ListDisplay {
    constructor() {
        this.currentPage = 1;
        this.listTotalCount = 0;
        this.elementId = "#list-total-count";
        this.currentPage = 1;
    }
    displayListTotalCnt(totalcount = 0) {
        let notice = $(this.elementId);
        if (notice.length > 0) {
            notice.text(`공고는 총 ${totalcount}개입니다.`);
        }
        else {
            notice = $("<p></p>")
                .attr("id", "list-total-count")
                .text(`공고는 총 ${totalcount}개입니다.`)
                .css({
                width: "300px",
                height: "50px",
                "line-height": "50px",
                "box-shadow": "0 0 10px rgba(0,0,0,0.8)",
                position: "relative",
                top: "0px",
                "background-color": "#f0f0f0",
                padding: "5px 10px",
                border: "1px solid #ccc",
                "border-radius": "5px",
                "text-align": "center",
                "font-size": "14px",
                "font-weight": "bold",
                color: "#333",
            });
            $(".contents").before(notice);
        }
    }
    display() {
        const current = Number(window.location.pathname.split("/").pop());
        $(".menu > ul > li > a").each(function () {
            const menuItemHref = Number($(this).attr("href").split("/").pop());
            if (menuItemHref === current) {
                $(this).addClass("current");
            }
        });
        this.fetchApiKeyAndData();
    }
    fetchApiKeyAndData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKeyResponse = yield fetchApiKey("key");
                apiKey = apiKeyResponse.apiKey;
                yield this.fetchInitialData();
            }
            catch (error) {
                this.displayError();
            }
        });
    }
    fetchInitialData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fetchData(this.currentPage, "", "");
            }
            catch (error) {
                this.displayError();
            }
        });
    }
    fetchDataRequest(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return $.ajax({
                url: "https://openapi.gg.go.kr/GGJOBABARECRUSTM",
                type: "GET",
                data: params,
                dataType: "json",
                cache: false,
            });
        });
    }
    // protected async fetchData(page = 1, query: string, queryType = "") {
    //   try {
    //     const response = await fetchDataFromApi({
    //       apiKey,
    //       page,
    //       query,
    //       queryType,
    //       itemsPerPage,
    //     });
    //     console.log("Data fetched successfully:", response);
    //     this.handleResponse(response, page);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //     this.displayError();
    //   }
    // }
    buildParams(page, query, queryType) {
        const baseParams = {
            KEY: apiKey,
            Type: "json",
            pIndex: page,
            pSize: 5,
            ENTRPRS_NM: "",
            PBANC_CONT: "",
        };
        if (query && queryType) {
            if (queryType === "enterprise") {
                baseParams.ENTRPRS_NM = query;
            }
            else if (queryType === "noticeName") {
                baseParams.PBANC_CONT = query;
            }
        }
        return baseParams;
    }
    handleResponse(response, page) {
        if (response &&
            response.GGJOBABARECRUSTM &&
            Array.isArray(response.GGJOBABARECRUSTM) &&
            response.GGJOBABARECRUSTM.length > 1 &&
            response.GGJOBABARECRUSTM[1].row) {
            const jobData = response.GGJOBABARECRUSTM[1].row;
            this.listTotalCount =
                response.GGJOBABARECRUSTM[0].head[0].list_total_count;
            this.displayJobs(jobData);
            this.displayListTotalCnt(this.listTotalCount);
            this.updatePagination(page);
        }
        else {
            console.error("No job data available or unexpected response format");
            this.displayNoResults();
        }
    }
    displayJobs(jobs) {
        $(".job_list").empty();
        jobs.forEach(function (job) {
            const jobItem = `
      <li>
        <div class="first_column">
          <div>공고명: ${job.PBANC_CONT}</div>
          <div>기업명: ${job.ENTRPRS_NM}</div>
          <div>채용인원: ${job.EMPLMNT_PSNCNT}</div>
        </div>
        <div class="second_column">
          <div>경력: ${job.CAREER_DIV}</div>
          <div>학력: ${job.ACDMCR_DIV}</div>
          <div>모집분야: ${job.RECRUT_FIELD_NM}</div>
        </div>
        <div class="third_column">
          <div>근무지역: ${job.WORK_REGION_CONT}</div>
          <div>접수 시작일: ${job.RCPT_BGNG_DE}</div>
          <div>접수 종료일: ${job.RCPT_END_DE}</div>
        </div>
        <div class="content_link">
          <a href="${job.URL}" target="_blank">공고<br />보기</a>
        </div>
      </li>
    `;
            $(".job_list").append(jobItem);
        });
    }
    displayNoResults() {
        $(".job_list").empty();
        const noResultsMessage = `
    <li>
      <div class="no_results">검색 결과가 없습니다.</div>
    </li>
  `;
        $(".job_list").append(noResultsMessage);
    }
    displayError() {
        $(".job_list").empty();
        const errorMessage = `
    <li>
      <div class="error_message">데이터를 가져오는 데 문제가 발생했습니다. 다시 시도해주세요.</div>
    </li>
  `;
        $(".job_list").append(errorMessage);
    }
    updatePagination(currentPage) {
        const totalPages = Math.ceil(this.listTotalCount / itemsPerPage);
        const pagesPerGroup = 10;
        const currentGroup = Math.ceil(currentPage / pagesPerGroup);
        const startPage = (currentGroup - 1) * pagesPerGroup + 1;
        const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);
        $(".pagination").empty();
        if (currentPage > 1) {
            $(".pagination").append(`<span class="page" data-page="1"><<</span>`);
        }
        if (currentGroup > 1) {
            $(".pagination").append(`<span class="page" data-page="${startPage - 1}"><</span>`);
        }
        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                $(".pagination").append(`<span class="page active" data-page="${i}">${i}</span>`);
            }
            else {
                $(".pagination").append(`<span class="page" data-page="${i}">${i}</span>`);
            }
        }
        if (endPage < totalPages) {
            $(".pagination").append(`<span class="page" data-page="${endPage + 1}">></span>`);
        }
        if (currentPage < totalPages) {
            $(".pagination").append(`<span class="page" data-page="${totalPages}">>></span>`);
        }
        $(".pagination")
            .off("click", ".page")
            .on("click", ".page", (event) => {
            const page = $(event.target).data("page");
            const query = String($("#searchInput").val());
            const searchType = String($("#searchType").val());
            console.log("Fetching page:", page); // 디버깅 로그 추가
            fetchData(page, query, searchType);
        });
    }
}
export default ListDisplay;
//# sourceMappingURL=Display.js.map
//# sourceMappingURL=Display.js.map