// import { displayError, displayNoResults } from "./Display";
import { fetchApiKey } from "../functions/fetchApiKey.js";
import ListDisplay from "./Display";
import { URLSearchParams } from "node:url";
// const apiUrl = "https://openapi.gg.go.kr/JobFndtnTosAct";
// const itemsPerPage = 10;
// let currentPage = 1;
// let listTotalCount = 0;
// let isLoading = false;
// let apiKey = ""; // 전역 변수로 API 키를 선언
// const listDisplay = new ListDisplay();
// interface Params {
//   Key: string;
//   Type: string;
//   pIndex: string;
//   pSize: string;
// }
export default class Api {
  private currentPage = 1;
  private listTotalCount = 0;
  private itemsPerPage = 10;
  private isLoading = false;
  private apiKey: string;
  private apiUrl: string;
  private listDisplay: ListDisplay;
  private params: URLSearchParams;

  constructor(currentPage: number, itemsPerPage: number) {
    $(window).on("scroll", this.handleScroll);

    this.listDisplay = new ListDisplay();
    this.apiKey = "";
    this.apiUrl = "https://openapi.gg.go.kr/JobFndtnTosAct";
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.params = new URLSearchParams({
      Key: this.apiKey,
      Type: "json",
      pIndex: String(this.currentPage),
      pSize: String(this.itemsPerPage),
      ENTRPRS_NM: "",
    });
  }

  // 서버에서 API 키를 가져오고 데이터를 요청하는 함수
  protected async fetchApiKeyAndData() {
    try {
      const apiKeyResponse = await fetchApiKey("external"); // API 키 요청
      this.apiKey = apiKeyResponse.apiKey; // 받아온 API 키 설정
      await this.fetchInitialData(); // 초기 데이터 요청
      $(window).on("scroll", this.handleScroll); // 스크롤 이벤트 핸들러 등록
    } catch (error) {
      this.listDisplay.displayError(); // 오류 발생 시 에러 표시
    }
  }

  // 초기 데이터를 가져오는 함수
  protected async fetchInitialData() {
    try {
      await this.fetchMoreData(this.currentPage); // 초기 데이터 요청
    } catch (error) {
      this.listDisplay.displayError(); // 오류 발생 시 에러 표시
    }
  }

  // 추가 데이터를 가져오는 함수
  protected async fetchMoreData(page: number) {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      const url = new URL(this.apiUrl);
      url.search = new URLSearchParams(this.params).toString();

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      console.log("Data fetched successfully:", data);

      if (
        data &&
        data.JobFndtnTosAct &&
        data.JobFndtnTosAct.length > 0 &&
        data.JobFndtnTosAct[1].row
      ) {
        const externalData = data.JobFndtnTosAct[1].row;
        this.listTotalCount = data.JobFndtnTosAct[0].head[0].list_total_count;
        this.displayExternalData(externalData);
        this.listDisplay.displayListTotalCnt(this.listTotalCount);
        if (
          Number(this.listTotalCount) <=
          Number(this.currentPage) * Number(this.itemsPerPage)
        ) {
          $(window).off("scroll", this.handleScroll);
        }
      } else {
        console.error("No external data available or unexpected response");
        this.listDisplay.displayNoResults();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      this.listDisplay.displayError();
    } finally {
      this.isLoading = false;
    }
  }

  protected displayExternalData(data: any) {
    data.forEach(function (item: any) {
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

  protected handleScroll() {
    const scrollPosition = $(window).scrollTop()!;
    const documentHeight = $(document).height()!;

    if (scrollPosition >= documentHeight - 50) {
      this.currentPage++;
      this.fetchMoreData(this.currentPage);
    }
  }
}
