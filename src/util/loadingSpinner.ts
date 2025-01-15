export const loadingSpinner = (isLoading: boolean) => {
  const loadingSpinnerElement = document.querySelector(".loading-spinner")!;
  // 로딩 스피너 표시 여부 조정
  if (isLoading) {
    loadingSpinnerElement.classList.remove("hide"); // 'show' 클래스 추가
  } else {
    loadingSpinnerElement.classList.add("hide"); // 'show' 클래스 제거
  }
};
