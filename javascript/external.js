import { displayError, displayNoResults } from "./script.js";
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
  fetchInitialData();
});

// 서버에서 API 키를 가져오는 함수 (async/await 사용)
async function getApiKey() {
  try {
    const response = await $.get("/.netlify/functions/get-api-external");
    return response.apiKey;
  } catch (error) {
    console.error("Error fetching API key", error);
    throw error;
  }
}

// 초기 데이터를 가져오는 함수
async function fetchInitialData() {
  try {
    apiKey = await getApiKey(); // API 키를 받아옴
    console.log(apiKey);
    await fetchMoreData(currentPage); // 초기 데이터 요청
    $(window).on("scroll", handleScroll); // 스크롤 이벤트 핸들러 등록
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
    const response = await $.ajax({
      url: apiUrl,
      type: "GET",
      data: params,
      dataType: "json",
    });

    console.log("Data fetched successfully:", response);

    if (
      response &&
      response.JobFndtnTosAct &&
      response.JobFndtnTosAct.length > 0 &&
      response.JobFndtnTosAct[1].row
    ) {
      const externalData = response.JobFndtnTosAct[1].row;
      listTotalCount = response.JobFndtnTosAct[0].head[0].list_total_count;
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
