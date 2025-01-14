import { listTotalCount } from "../functions/listTotalDisplay.js";
export default class ExternalAct {
    currentPage = 1;
    listTotalCount = 0;
    itemsPerPage = 10;
    isLoading = false;
    apiKey;
    apiUrl;
    data;
    constructor(currentPage, itemsPerPage) {
        $(window).on("scroll", this.handleScroll.bind(this)); // this 바인딩
        this.apiKey = process.env.EXTERNAL_APIKEY;
        // this.listDisplay = new ListDisplay();
        this.apiUrl = "https://openapi.gg.go.kr/JobFndtnTosAct";
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;
        this.isLoading = false;
        this.data = null;
        console.log("fetchMoreData");
        this.fetchApiKeyAndData();
    }
    // 서버에서 API 키를 가져오고 데이터를 요청하는 함수
    async fetchApiKeyAndData() {
        try {
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
        console.log("fetchMoreData");
        if (this.isLoading)
            return;
        this.isLoading = true;
        try {
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
                if (Number(this.listTotalCount) <=
                    Number(this.currentPage) * Number(this.itemsPerPage)) {
                    $(window).off("scroll", this.handleScroll);
                }
            }
            else {
                // this.listDisplay.displayNoResults();
            }
        }
        catch (error) {
            // this.listDisplay.displayError();
        }
        finally {
            this.isLoading = false;
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
    // 스크롤 이벤트 핸들러
    handleScroll = () => {
        const scrollPosition = $(window).scrollTop();
        const documentHeight = $(document).height();
        if (scrollPosition >= documentHeight - 50) {
            this.currentPage++;
            this.fetchMoreData(this.currentPage);
        }
    };
}
//# sourceMappingURL=ExternalAct.js.map