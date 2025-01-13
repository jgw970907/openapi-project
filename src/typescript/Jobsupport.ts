import { fetchApiKey } from "../functions/fetchApiKey";
import ListDisplay from "./Display";
const apiUrl = "https://openapi.gg.go.kr/JobFndtnSportPolocy";

export class JobSupport {
  apiKey: string;
  currentPage: number;
  itemsPerPage: number;
  listTotalCount: number;
  listDisplay: ListDisplay;
  isLoading: boolean;
  constructor(currentPage: number, itemsPerPage: number) {
    this.listDisplay = new ListDisplay();
    this.apiKey = "";
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.listTotalCount = 0;
    this.isLoading = false;
    $(window).on("scroll", this.handleScroll);
  }
  public async fetchApiKeyAndData() {
    try {
      const apiKeyResponse = await fetchApiKey("external");
      this.apiKey = apiKeyResponse.apiKey;
      await this.fetchInitialData();
      $(window).on("scroll", this.handleScroll);
    } catch (error) {
      this.listDisplay.displayError();
    }
  }

  public async fetchInitialData() {
    try {
      await this.fetchMoreData(this.currentPage);
    } catch (error) {
      this.listDisplay.displayError();
    }
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
      url: apiUrl,
      type: "GET",
      data: params,
      dataType: "json",
      success: function (response) {
        console.log("Data fetched successfully:", response);

        if (
          response &&
          response.JobFndtnSportPolocy &&
          response.JobFndtnSportPolocy.length > 0 &&
          response.JobFndtnSportPolocy[1].row
        ) {
          const supportData = response.JobFndtnSportPolocy[1].row;
          this.listTotalCount =
            response.JobFndtnSportPolocy[0].head[0].list_total_count;
          this.displaySupportData(supportData);

          this.listDisplay.displayListTotalCnt(this.listTotalCount);
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
      complete: function () {
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

  private handleScroll() {
    const scrollPosition = $(window).scrollTop()!;
    const documentHeight = $(document).height()!;

    if (scrollPosition >= documentHeight - 50) {
      this.currentPage++;
      this.fetchMoreData(this.currentPage);
    }
  }
}
