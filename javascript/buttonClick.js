import { fetchData } from "./script.js";

$("#searchBtn").on("click", function () {
  const searchType = $("#searchType").val();
  const query = $("#searchInput").val();
  fetchData(1, query, searchType);
});

$("#searchInput").on("keypress", function (e) {
  if (e.which === 13) {
    const searchType = $("#searchType").val();
    const query = $("#searchInput").val();
    fetchData(1, query, searchType);
  }
});

$("#resetBtn").on("click", function () {
  $("#searchType").val("");

  $("#searchInput").val("");

  fetchData();
});
