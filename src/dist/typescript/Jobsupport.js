import { fetchApiKey } from "../functions/fetchApiKey.js";
const apiUrl = "https://openapi.gg.go.kr/JobFndtnSportPolocy";
export class JobSupportClass {
    apiKey;
    currentPage;
    itemsPerPage;
    listTotalCount;
    isLoading;
    responseData;
    constructor(currentPage, itemsPerPage) {
        this.apiKey = "";
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;
        this.listTotalCount = 0;
        this.isLoading = false;
        this.responseData = null;
        $(window).on("scroll", this.handleScroll);
    }
    async fetchApiKeyAndData() {
        try {
            const apiKeyResponse = await fetchApiKey("external");
            this.apiKey = apiKeyResponse.apiKey;
            await this.fetchInitialData();
        }
        catch (error) {
            // this.listDisplay.displayError();
        }
    }
    async fetchInitialData() {
        try {
            await this.fetchMoreData(this.currentPage);
        }
        catch (error) {
            // this.listDisplay.displayError();
        }
    }
    async fetchMoreData(page = 1) {
        if (this.isLoading)
            return;
        this.isLoading = true;
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
                console.log("Data fetched successfully:", response);
                this.responseData = response;
                if (this.responseData &&
                    this.responseData.JobFndtnSportPolocy &&
                    this.responseData.JobFndtnSportPolocy.length > 0 &&
                    this.responseData.JobFndtnSportPolocy[1].row) {
                    const supportData = this.responseData.JobFndtnSportPolocy[1].row;
                    this.listTotalCount =
                        this.responseData.JobFndtnSportPolocy[0].head[0].list_total_count;
                    this.displaySupportData(supportData);
                    this.listDisplay.displayListTotalCnt(this.listTotalCount);
                    if (this.listTotalCount <= this.currentPage * this.itemsPerPage) {
                        $(window).off("scroll", this.handleScroll);
                    }
                }
                else {
                    console.error("No external data available or unexpected response");
                    this.displayNoResults();
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching data:", status, error);
                this.listDisplay.displayError();
            },
            complete: function () {
                this.isLoading = false;
            },
        });
    }
    displaySupportData(data) {
        data.forEach(function (item) {
            const listItem = `
        <li>
          <div>지원정책: ${item.PBLANC_TITLE}</div>
          <div>기관명: ${item.INST_NM}</div>
          <hr/>
          <div>모집시작일: ${item.RECRUT_BEGIN_DE}</div>
          <div>모집종료일: ${item.RECRUT_END_DE}</div>
          <hr/>
          <div>카테고리명: ${item.DIV_NM}</div>
          <div>지역: ${item.REGION_NM}</div>
          <div class="detailUrl"><a href="${item.DETAIL_PAGE_URL}" target="_blank">상세보기</a></div>
        </li>
      `;
            $(".support_list").append(listItem);
        });
    }
    handleScroll() {
        const scrollPosition = $(window).scrollTop();
        const documentHeight = $(document).height();
        if (scrollPosition >= documentHeight - 50) {
            this.currentPage++;
            this.fetchMoreData(this.currentPage);
        }
    }
}
//# sourceMappingURL=Jobsupport.js.map