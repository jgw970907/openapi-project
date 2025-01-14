import { listTotalCount } from "../functions/listTotalDisplay";
export class EduClass {
  apiKey: string;
  apiUrl: string;
  currentPage: number;
  itemsPerPage: number;
  listTotalCount: number;
  responseData: any;
  constructor(currentPage: number, itemsPerPage: number) {
    this.apiKey = process.env.EDU_APIKEY!;
    this.apiUrl = "https://openapi.gg.go.kr/JobFndtnEduTraing";
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.listTotalCount = 0;
    this.responseData = null;
    this.fetchApiKeyAndData();
    $("#loadMoreBtn").on("click", () => {
      this.currentPage++;
      this.fetchMoreData(this.currentPage);
    });
  }
  public async fetchApiKeyAndData() {
    try {
      await this.fetchInitialData();
    } catch (error) {
      // listDisplay.displayError();
    }
  }

  public async fetchInitialData() {
    try {
      await this.fetchMoreData(this.currentPage); // 초기 데이터 요청
    } catch (error) {
      // listDisplay.displayError(); // 오류 발생 시 에러 표시
    }
  }

  public async fetchMoreData(page = 1) {
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
        console.log("Daata fetched successfully", response);
        this.responseData = response;
        if (
          this.responseData &&
          this.responseData.JobFndtnEduTraing &&
          this.responseData.JobFndtnEduTraing.length > 0 &&
          this.responseData.JobFndtnEduTraing[1].row
        ) {
          const trainData = response.JobFndtnEduTraing[1].row;
          this.listTotalCount =
            this.responseData.JobFndtnEduTraing[0].head[0].list_total_count;
          this.displayTrain(trainData);
          this.updateLoadMoreButton();
          listTotalCount(this.listTotalCount);
        } else {
          console.error("No train data available or unexpected response");
          this.displayNoResults();
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
        // listDisplay.displayError();
      },
    });
  }

  public displayTrain(trains: any) {
    trains.forEach((train: any) => {
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

  public updateLoadMoreButton() {
    const totalPages = Math.ceil(this.listTotalCount / this.itemsPerPage);
    const remainingPages = totalPages - this.currentPage;

    if (remainingPages > 0) {
      $("#loadMoreBtn").text(`더보기 (${remainingPages}회 가능)`);
    } else {
      $("#loadMoreBtn").hide();
    }
  }

  public displayNoResults() {
    $(".train_list").empty();
    const noResultsMessage = `
    <li>
      <div class="no_results">검색 결과가 없습니다.</div>
    </li>
  `;
    $(".train_list").append(noResultsMessage);
  }
}
