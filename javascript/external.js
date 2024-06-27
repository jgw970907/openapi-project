import { displayError, displayNoResults } from "./script.js";
import { fetchApiKey } from "./fetchApiKey.js";
import ListDisplay from "./script.js";

const apiUrl = "https://openapi.gg.go.kr/JobFndtnTosAct";
const itemsPerPage = 10;
let currentPage = 1;
let listTotalCount = 0;
let isLoading = false;
let apiKey = ""; // 전역 변수로 API 키를 선언
const listDisplay = new ListDisplay();

$(document).ready(function () {
  // 초기 API 키 요청 후 데이터 가져오기
  fetchApiKeyAndData();
});

// 서버에서 API 키를 가져오고 데이터를 요청하는 함수
async function fetchApiKeyAndData() {
  try {
    const apiKeyResponse = await fetchApiKey("external"); // API 키 요청
    apiKey = apiKeyResponse.apiKey; // 받아온 API 키 설정
    await fetchInitialData(); // 초기 데이터 요청
    $(window).on("scroll", handleScroll); // 스크롤 이벤트 핸들러 등록
  } catch (error) {
    displayError(); // 오류 발생 시 에러 표시
  }
}

// 초기 데이터를 가져오는 함수
async function fetchInitialData() {
  try {
    await fetchMoreData(currentPage); // 초기 데이터 요청
  } catch (error) {
    displayError(); // 오류 발생 시 에러 표시
  }
}

// 추가 데이터를 가져오는 함수
async function fetchMoreData(page) {
  if (!apiKey) {
    console.error("API key is not available yet", apiKey);
    return;
  }

  if (isLoading) return;
  isLoading = true;

  let params = {
    KEY: apiKey,
    Type: "json",
    pIndex: page,
    pSize: itemsPerPage,
  };

  try {
    const url = new URL(apiUrl);
    url.search = new URLSearchParams(params).toString();

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
      listTotalCount = data.JobFndtnTosAct[0].head[0].list_total_count;
      displayExternalData(externalData);
      listDisplay.displayListTotalCnt(listTotalCount);
      if (listTotalCount <= currentPage * itemsPerPage) {
        $(window).off("scroll", handleScroll);
      }
    } else {
      console.error("No external data available or unexpected response");
      displayNoResults();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    displayError();
  } finally {
    isLoading = false;
  }
}

function displayExternalData(data) {
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

function handleScroll() {
  const scrollPosition = $(window).scrollTop() + $(window).height();
  const documentHeight = $(document).height();

  if (scrollPosition >= documentHeight - 50) {
    currentPage++;
    fetchMoreData(currentPage);
  }
}

$(window).on("scroll", handleScroll);
