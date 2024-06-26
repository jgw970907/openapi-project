import { displayError, displayNoResults } from "./script.js";
import ListDisplay from "./script.js";
const apiUrl = "https://openapi.gg.go.kr/JobFndtnSportPolocy";
const apiKey = "";

let currentPage = 1;
const itemsPerPage = 10;
let listTotalCount = 0;
let isLoading = false;
const listDisplay = new ListDisplay();

$(document).ready(function () {
  fetchMoreData();
});

function fetchMoreData(page = 1) {
  if (isLoading) return;
  isLoading = true;

  let params = {
    KEY: apiKey,
    Type: "json",
    pIndex: page,
    pSize: itemsPerPage,
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
        listTotalCount =
          response.JobFndtnSportPolocy[0].head[0].list_total_count;
        displaySupportData(supportData);

        listDisplay.displayListTotalCnt(listTotalCount);
        if (listTotalCount <= currentPage * itemsPerPage) {
          $(window).off("scroll", handleScroll);
        }
      } else {
        console.error("No external data available or unexpected response");
        displayNoResults();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", status, error);
      displayError();
    },
    complete: function () {
      isLoading = false;
    },
  });
}

function displaySupportData(data) {
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

function handleScroll() {
  const scrollPosition = $(window).scrollTop() + $(window).height();
  const documentHeight = $(document).height();

  if (scrollPosition >= documentHeight - 50) {
    currentPage++;
    fetchMoreData(currentPage);
  }
}

$(window).on("scroll", handleScroll);
