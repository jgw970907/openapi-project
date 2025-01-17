import { fetchApiKey } from "../util/fetchApiKey.js";
import { listTotalCount } from "../util/listTotalDisplay.js";
import { loadingSpinner } from "../util/loadingSpinner.js";
export default class ExternalActClass {
    currentPage = 1;
    listTotalCount = 0;
    itemsPerPage = 10;
    isLoading = false;
    apiKey;
    apiUrl;
    data;
    observer = null;
    constructor(currentPage, itemsPerPage) {
        this.apiUrl = "https://openapi.gg.go.kr/JobFndtnTosAct";
        this.apiKey = "";
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;
        this.isLoading = false;
        this.data = null;
        this.fetchApiKeyAndData();
        this.initIntersectionObserver();
    }
    initIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        };
        const target = document.querySelector("#infinite-scroll-target");
        if (target) {
            this.observer = new IntersectionObserver(this.handleIntersection, observerOptions);
            this.observer.observe(target);
        }
    }
    handleIntersection = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !this.isLoading) {
                this.currentPage++;
                console.log("currentPage", this.currentPage);
                this.fetchMoreData(this.currentPage);
            }
        });
    };
    // 서버에서 API 키를 가져오고 데이터를 요청하는 함수
    async fetchApiKeyAndData() {
        try {
            if (!this.apiKey) {
                const { apiKey } = await fetchApiKey("external");
                this.apiKey = apiKey;
            }
            await this.fetchInitialData();
        }
        catch (error) {
            // this.listDisplay.displayError();
        }
    }
    // 초기 데이터를 가져오는 함수
    async fetchInitialData() {
        try {
            await this.fetchMoreData(this.currentPage);
        }
        catch (error) {
            // this.listDisplay.displayError();
        }
    }
    // 추가 데이터를 가져오는 함수
    async fetchMoreData(page) {
        if (this.isLoading)
            return;
        try {
            this.isLoading = true;
            loadingSpinner(this.isLoading);
            const url = new URL(this.apiUrl); // 표준 브라우저 URL API 사용
            url.search = new URLSearchParams({
                Key: this.apiKey,
                Type: "json",
                pIndex: String(page),
                pSize: String(this.itemsPerPage),
            }).toString();
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            this.data = await response.json();
            console.log((this.data, "this.data"));
            if (this.data &&
                this.data.JobFndtnTosAct &&
                this.data.JobFndtnTosAct.length > 0 &&
                this.data.JobFndtnTosAct[1].row) {
                const externalData = this.data.JobFndtnTosAct[1].row;
                this.listTotalCount =
                    this.data.JobFndtnTosAct[0].head[0].list_total_count;
                this.displayExternalData(externalData);
                listTotalCount(this.listTotalCount);
                if (this.listTotalCount <= this.currentPage * this.itemsPerPage) {
                    this.stopObserver(); // 더 이상 데이터를 불러오지 않음
                }
            }
            else {
                this.displayNoResults();
            }
        }
        catch (error) {
            this.displayNoResults();
        }
        finally {
            this.isLoading = false;
            loadingSpinner(this.isLoading);
        }
    }
    // 데이터를 화면에 출력
    displayExternalData(data) {
        console.log(data, "data");
        data.forEach(function (item) {
            const listItem = `
        <li>
          <div>공고명: ${item.PBLANC_TITLE}</div>
          <div>기관명: ${item.INST_NM}</div>
          <hr/>
          <div>모집시작일: ${item.RECRUT_BEGIN_DE}</div>
          <div>모집종료일: ${item.RECRUT_END_DE}</div>
          <hr/>
          <div>카테고리명: ${item.DIV_NM}</div>
          <div>지역명: ${item.REGION_NM}</div>
          <div class="detailUrl"><a href="${item.DETAIL_PAGE_URL}" target="_blank">상세보기</a></div>
        </li>
      `;
            $(".external_list").append(listItem);
        });
    }
    displayNoResults() {
        $(".support_list").empty();
        const noResultsMessage = `
    <li>
      <div class="no_results">검색 결과가 없습니다.</div>
    </li>
  `;
        $(".support_list").append(noResultsMessage);
    }
    // IntersectionObserver 중지
    stopObserver() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
//# sourceMappingURL=ExternalActClass.js.map