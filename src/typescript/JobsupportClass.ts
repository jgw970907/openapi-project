import { listTotalCount } from "../util/listTotalDisplay.js";
import { fetchApiKey } from "../util/fetchApiKey.js";
import { loadingSpinner } from "../util/loadingSpinner.js";

export class JobSupportClass {
  currentPage: number;
  itemsPerPage: number;
  listTotalCount: number;
  isLoading: boolean = false;
  responseData: any;
  apiUrl: string;
  apiKey: string;
  observer: IntersectionObserver | null = null;
  constructor(currentPage: number, itemsPerPage: number) {
    this.apiKey = "";
    this.apiUrl = "https://openapi.gg.go.kr/JobFndtnSportPolocy";
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.listTotalCount = 0;
    this.isLoading = false;
    this.responseData = null;
    this.fetchApiKeyAndData();
    this.initIntersectionObserver();
  }

  private initIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const target = document.querySelector("#infinite-scroll-target");

    if (target) {
      this.observer = new IntersectionObserver(
        this.handleIntersection,
        observerOptions
      );
      this.observer.observe(target);
    }
  }

  private handleIntersection = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !this.isLoading) {
        this.currentPage++;
        console.log("currentPage", this.currentPage);
        this.fetchMoreData(this.currentPage);
      }
    });
  };

  public async fetchApiKeyAndData() {
    try {
      await this.fetchInitialData();
    } catch (error) {}
  }

  public async fetchInitialData() {
    try {
      if (!this.apiKey) {
        const { apiKey } = await fetchApiKey("support");
        this.apiKey = apiKey;
      }
      await this.fetchMoreData(this.currentPage);
    } catch (error) {}
  }

  public async fetchMoreData(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;
    loadingSpinner(this.isLoading);

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
            this.stopObserver(); // 더 이상 데이터를 불러오지 않음
          }
        } else {
          this.displayNoResults();
        }
      },
      error: (xhr, status, error) => {
        this.displayNoResults();
      },
      complete: () => {
        this.isLoading = false;
        loadingSpinner(this.isLoading);
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

  // IntersectionObserver 중지
  private stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
