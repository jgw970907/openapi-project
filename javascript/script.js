import { fetchApiKey } from "./fetchApiKey";

const itemsPerPage = 5;
let currentPage = 1;
let listTotalCount = 0;
let apiKey = "";
class ListDisplay {
  constructor() {
    this.elementId = "#list-total-count";
  }

  displayListTotalCnt(totalcount = 0) {
    let notice = $(this.elementId);

    if (notice.length > 0) {
      notice.text(`공고는 총 ${totalcount}개입니다.`);
    } else {
      notice = $("<p></p>")
        .attr("id", "list-total-count")
        .text(`공고는 총 ${totalcount}개입니다.`)
        .css({
          width: "300px",
          height: "50px",
          "line-height": "50px",
          "box-shadow": "0 0 10px rgba(0,0,0,0.8)",
          position: "relative",
          top: "0px",
          "background-color": "#f0f0f0",
          padding: "5px 10px",
          border: "1px solid #ccc",
          "border-radius": "5px",
          "text-align": "center",
          "font-size": "14px",
          "font-weight": "bold",
          color: "#333",
        });

      $(".contents").before(notice);
    }
  }
}
const listDisplay = new ListDisplay();
$(document).ready(function () {
  const currentPage = window.location.pathname.split("/").pop();

  $(".menu > ul > li > a").each(function () {
    const menuItemHref = $(this).attr("href").split("/").pop();
    if (menuItemHref === currentPage) {
      $(this).addClass("current");
    }
  });
  fetchApiKeyAndData();
});
async function fetchApiKeyAndData() {
  try {
    const apiKeyResponse = await fetchApiKey("key");
    apiKey = apiKeyResponse.apiKey;
    await fetchInitialData();
  } catch (error) {
    displayError();
  }
}
async function fetchInitialData() {
  try {
    await fetchData(currentPage);
  } catch (error) {
    displayError();
  }
}
export async function fetchData(page = 1, query = "", queryType = "") {
  let params = {
    KEY: apiKey,
    Type: "json",
    pIndex: page,
    pSize: 5,
  };
  console.log("Requesting page:", page, "with params:", params); // 디버깅 로그 추가

  if (query && queryType) {
    if (queryType === "enterprise") {
      params = {
        ...params,
        ENTRPRS_NM: query,
      };
    } else if (queryType === "noticeName") {
      params = {
        ...params,
        PBANC_CONT: query,
      };
    }
  }

  $.ajax({
    url: "https://openapi.gg.go.kr/GGJOBABARECRUSTM",
    type: "GET",
    data: params,
    dataType: "json",
    cache: false,
    success: function (response) {
      console.log("Data fetched successfully:", response);
      if (
        response &&
        response.GGJOBABARECRUSTM &&
        Array.isArray(response.GGJOBABARECRUSTM) &&
        response.GGJOBABARECRUSTM.length > 1 &&
        response.GGJOBABARECRUSTM[1].row
      ) {
        const jobData = response.GGJOBABARECRUSTM[1].row;
        listTotalCount = response.GGJOBABARECRUSTM[0].head[0].list_total_count;
        displayJobs(jobData);
        listDisplay.displayListTotalCnt(listTotalCount);
        updatePagination(page);
      } else {
        console.error("No job data available or unexpected response format");
        displayNoResults();
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data:", status, error);
      displayError(); // 에러 메시지 표시 또는 다른 처리
    },
  });
}
export function displayJobs(jobs) {
  $(".job_list").empty();
  jobs.forEach(function (job) {
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

export function displayNoResults() {
  $(".job_list").empty();
  const noResultsMessage = `
    <li>
      <div class="no_results">검색 결과가 없습니다.</div>
    </li>
  `;
  $(".job_list").append(noResultsMessage);
}

export function displayError() {
  $(".job_list").empty();
  const errorMessage = `
    <li>
      <div class="error_message">데이터를 가져오는 데 문제가 발생했습니다. 다시 시도해주세요.</div>
    </li>
  `;
  $(".job_list").append(errorMessage);
}

function updatePagination(currentPage) {
  const totalPages = Math.ceil(listTotalCount / itemsPerPage);
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

  $(".page").on("click", function () {
    const page = $(this).data("page");
    const query = $("#searchInput").val();
    const searchType = $("#searchType").val();
    console.log("Fetching page:", page); // 디버깅 로그 추가
    fetchData(page, query, searchType);
  });
}
fetchData();
export default ListDisplay;
