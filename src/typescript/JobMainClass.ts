import { fetchApiKey } from "../util/fetchApiKey.js";
import { listTotalCount } from "../util/listTotalDisplay.js";
import Popup from "./Popup.js";

export default class JobMainClass {
  currentPage: number = 1;
  itemsPerPage: number = 10;
  listTotalCount: number = 0;
  query: string = "";
  searchType: string = "";
  apiKey: string;
  apiUrl: string;
  popup: Popup;
  constructor(currentPage: number, itemsPerPage: number) {
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.apiUrl = "https://openapi.gg.go.kr/GGJOBABARECRUSTM";
    this.apiKey = "";
    this.fetchApiKeyAndData();
    this.initializeEvents();
    this.popup = new Popup();
  }
  initializeEvents() {
    $(".pagination")
      .off("click", ".page")
      .on("click", ".page", (event) => {
        const page = $(event.target).data("page");
        this.currentPage = page;
        this.fetchHandler();
      });

    $("#searchBtn").on("click", async () => {
      this.query = String($("#searchInput").val());
      this.searchType = String($("#searchType").val());
      this.currentPage = 1; // 검색 시 페이지를 초기화
      this.fetchHandler();
    });

    $("#searchInput").on("keypress", async (e) => {
      if (e.which === 13) {
        this.query = String($("#searchInput").val());
        this.searchType = String($("#searchType").val());
        this.currentPage = 1; // 검색 시 페이지를 초기화
        this.fetchHandler();
      }
    });

    $("#resetBtn").on("click", async () => {
      $("#searchType").val("");
      $("#searchInput").val("");
      this.query = "";
      this.searchType = "";
      this.currentPage = 1; // 페이지 초기화
      this.fetchHandler();
    });
  }

  public display() {
    const current = Number(window.location.pathname.split("/").pop());
    $(".menu > ul > li > a").each(function () {
      const menuItemHref = Number($(this)!.attr("href")!.split("/").pop());
      if (menuItemHref === current) {
        $(this).addClass("current");
      }
    });
    this.fetchApiKeyAndData();
  }

  async fetchApiKeyAndData() {
    try {
      const { apiKey } = await fetchApiKey("key");
      this.apiKey = apiKey;
      await this.fetchHandler();
    } catch (error) {
      this.displayError();
    }
  }
  async fetchHandler() {
    try {
      const params = this.buildParams(
        this.currentPage,
        this.query,
        this.searchType
      );
      const result = await this.fetchDataRequest(params);
      this.handleResponse(result, this.currentPage);
    } catch (error) {
      this.displayError();
    }
  }

  protected async fetchDataRequest(params: any): Promise<any> {
    return $.ajax({
      url: this.apiUrl,
      type: "GET",
      data: params,
      dataType: "json",
      cache: false,
    });
  }

  public buildParams(page: number, query: string, queryType: string) {
    const baseParams = {
      KEY: this.apiKey,
      Type: "json",
      pIndex: page,
      pSize: this.itemsPerPage,
      ENTRPRS_NM: "",
      PBANC_CONT: "",
    };
    if (query && queryType) {
      if (queryType === "enterprise") {
        baseParams.ENTRPRS_NM = query;
      } else if (queryType === "noticeName") {
        baseParams.PBANC_CONT = query;
      }
    }
    return baseParams;
  }

  public handleResponse(response: any, page: number) {
    if (
      response &&
      response.GGJOBABARECRUSTM &&
      Array.isArray(response.GGJOBABARECRUSTM) &&
      response.GGJOBABARECRUSTM.length > 1 &&
      response.GGJOBABARECRUSTM[1].row
    ) {
      const jobData = response.GGJOBABARECRUSTM[1].row;
      this.listTotalCount =
        response.GGJOBABARECRUSTM[0].head[0].list_total_count;
      this.displayJobs(jobData);
      listTotalCount(this.listTotalCount);
      this.updatePagination(page);
    } else {
      console.error("No job data available or unexpected response format");
      this.displayNoResults();
    }
  }

  protected displayJobs(jobs: any) {
    $(".job_list").empty();
    jobs.forEach(function (job: any) {
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

  public displayNoResults() {
    $(".job_list").empty();
    const noResultsMessage = `
    <li>
      <div class="no_results">검색 결과가 없습니다.</div>
    </li>
  `;
    $(".job_list").append(noResultsMessage);
  }

  public displayError() {
    $(".job_list").empty();
    const errorMessage = `
    <li>
      <div class="error_message">데이터를 가져오는 데 문제가 발생했습니다. 다시 시도해주세요.</div>
    </li>
  `;
    $(".job_list").append(errorMessage);
  }

  protected updatePagination(currentPage: number) {
    const totalPages = Math.ceil(this.listTotalCount / this.itemsPerPage);
    const pagesPerGroup = 10;
    const currentGroup = Math.ceil(currentPage / pagesPerGroup);
    const startPage = (currentGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);

    $(".pagination").empty();

    if (currentPage > 1) {
      $(".pagination").append(`<span class="page" data-page="1"><<</span>`);
    }

    if (currentGroup > 1) {
      $(".pagination").append(
        `<span class="page" data-page="${startPage - 1}"><</span>`
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i === currentPage) {
        $(".pagination").append(
          `<span class="page active" data-page="${i}">${i}</span>`
        );
      } else {
        $(".pagination").append(
          `<span class="page" data-page="${i}">${i}</span>`
        );
      }
    }

    if (endPage < totalPages) {
      $(".pagination").append(
        `<span class="page" data-page="${endPage + 1}">></span>`
      );
    }

    if (currentPage < totalPages) {
      $(".pagination").append(
        `<span class="page" data-page="${totalPages}">>></span>`
      );
    }
  }
}
