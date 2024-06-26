import { displayError, displayNoResults } from "./script.js";
import ListDisplay from "./script.js";
const apiUrl = "https://openapi.gg.go.kr/JobFndtnEduTraing";
const apiKey = "";
let currentPage = 1;
const itemsPerPage = 10;
let listTotalCount = 0;
const listDisplay = new ListDisplay();
$("#loadMoreBtn").on("click", function () {
  currentPage++;
  fetchMoreData(currentPage);
});
$(document).ready(function () {
  fetchMoreData();
});
function fetchMoreData(page = 1) {
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
      console.log("Daata fetched successfully", response);
      if (
        response &&
        response.JobFndtnEduTraing &&
        response.JobFndtnEduTraing.length > 0 &&
        response.JobFndtnEduTraing[1].row
      ) {
        const trainData = response.JobFndtnEduTraing[1].row;
        listTotalCount = response.JobFndtnEduTraing[0].head[0].list_total_count;
        displayTrain(trainData);
        updateLoadMoreButton();
        listDisplay.displayListTotalCnt(listTotalCount);
      } else {
        console.error("No train data available or unexpected response");
        displayNoResults();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", status, error);
      displayError();
    },
  });
}

function displayTrain(trains) {
  trains.forEach(function (train) {
    const trainItem = `
      <li>
        <div class="first_row">
          <div>훈련명: ${train.PBLANC_TITLE}</div>
        </div>
        <div class="second_row">
          <div>훈련분야: ${train.DIV_NM}</div>
          <div>훈련형태: ${train.INST_NM}</div>
        </div>
        <div class="third_row">
          <div>훈련지역: ${train.REGION_NM}</div>
          <div>접수 시작일: ${train.RECRUT_BEGIN_DE}</div>
          <div>접수 종료일: ${train.RECRUT_END_DE}</div>
        </div>
        <div class="train_link">
          <a href="${train.DETAIL_PAGE_URL}" target="_blank">공고<br />보기</a>
        </div>
      </li>
        `;
    $(".train_list").append(trainItem);
  });
}

function updateLoadMoreButton() {
  const totalPages = Math.ceil(listTotalCount / itemsPerPage);
  const remainingPages = totalPages - currentPage;

  if (remainingPages > 0) {
    $("#loadMoreBtn").text(`더보기 (${remainingPages}회 가능)`);
  } else {
    $("#loadMoreBtn").hide();
  }
}
