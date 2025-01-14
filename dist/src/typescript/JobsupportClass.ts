import { listTotalCount } from "../functions/listTotalDisplay.js";

export class JobSupportClass {
  apiKey: string;
  currentPage: number;
  itemsPerPage: number;
  listTotalCount: number;
  isLoading: boolean;
  responseData: any;
  apiUrl: string;
  constructor(currentPage: number, itemsPerPage: number) {
    this.apiKey = process.env.JOB_APIKEY!;
    this.apiUrl = "https://openapi.gg.go.kr/JobFndtnSportPolocy";
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.listTotalCount = 0;
    this.isLoading = false;
    this.responseData = null;
    this.fetchApiKeyAndData();
    $(window).on("scroll", this.handleScroll);
  }
  public async fetchApiKeyAndData() {
    try {
      await this.fetchInitialData();
    } catch (error) {}
  }

  public async fetchInitialData() {
    try {
      await this.fetchMoreData(this.currentPage);
    } catch (error) {}
  }

  public async fetchMoreData(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;

    let params = {
      KEY: this.apiKey,
      Type: "json",
      pIndex: page,
      pSize: this.itemsPerPage,
    };

    $.ajax({
      url: this.apiUrl,
      type: "GET",
      data: params,
      dataType: "json",
      success: (response) => {
        console.log("Data fetched successfully:", response);
        this.responseData = response;
        if (
          this.responseData &&
          this.responseData.JobFndtnSportPolocy &&
          this.responseData.JobFndtnSportPolocy.length > 0 &&
          this.responseData.JobFndtnSportPolocy[1].row
        ) {
          const supportData = this.responseData.JobFndtnSportPolocy[1].row;
          this.listTotalCount =
            this.responseData.JobFndtnSportPolocy[0].head[0].list_total_count;
          this.displaySupportData(supportData);

          listTotalCount(this.listTotalCount);
          if (this.listTotalCount <= this.currentPage * this.itemsPerPage) {
            $(window).off("scroll", this.handleScroll);
          }
        } else {
          console.error("No external data available or unexpected response");
          this.displayNoResults();
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
        this.listDisplay.displayError();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  public displaySupportData(data: any): void {
    data.forEach(function (item: any) {
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
  public displayNoResults() {
    $(".support_list").empty();
    const noResultsMessage = `
    <li>
      <div class="no_results">검색 결과가 없습니다.</div>
    </li>
  `;
    $(".support_list").append(noResultsMessage);
  }
  private handleScroll = () => {
    const scrollPosition = $(window).scrollTop()! + $(window).height()!;
    const documentHeight = $(document).height()!;
    console.log(scrollPosition, documentHeight);
    if (scrollPosition >= documentHeight - 50) {
      this.currentPage++;
      console.log("currentpage", this.currentPage);
      this.fetchMoreData(this.currentPage);
    }
  };
}