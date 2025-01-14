export default class Popup {
  popup: HTMLElement | null;
  closeBtn: HTMLButtonElement | null;
  dontShowAgainCheckbox: HTMLInputElement | null;
  okBtn: HTMLButtonElement | null;

  constructor() {
    this.popup = document.getElementById("popup");
    this.closeBtn = document.querySelector(
      ".close-btn"
    ) as HTMLButtonElement | null;
    this.dontShowAgainCheckbox = document.getElementById(
      "dontShowAgainCheckbox"
    ) as HTMLInputElement | null;
    this.okBtn = document.getElementById("okBtn") as HTMLButtonElement | null;
    if (
      this.popup &&
      this.closeBtn &&
      this.dontShowAgainCheckbox &&
      this.okBtn
    ) {
      this.initializeEvents();
    }
  }

  private setCookie(name: string, value: string, days: number): void {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  private getCookie(name: string): string {
    const cookieArr = document.cookie.split(";").map((c) => c.trim());
    const cookie = cookieArr.find((c) => c.startsWith(`${name}=`));
    return cookie ? cookie.substring(name.length + 1) : "";
  }

  public showPopup() {
    if (this.popup) {
      this.popup.style.display = "flex";
    }
  }

  private hidePopup() {
    if (this.popup) {
      this.popup.style.display = "none";
    }
  }

  private initializeEvents() {
    // '확인' 버튼 클릭 이벤트
    this.okBtn?.addEventListener("click", () => {
      if (this.dontShowAgainCheckbox?.checked) {
        this.setCookie("popupSeen", "true", 7);
      }
      this.hidePopup();
    });

    // 닫기 버튼 클릭 이벤트
    this.closeBtn?.addEventListener("click", () => {
      this.hidePopup();
    });

    // 외부 클릭으로 팝업 닫기
    window.addEventListener("click", (event) => {
      if (this.popup && event.target === this.popup) {
        this.hidePopup();
      }
    });

    // 페이지 로드 시 쿠키 확인 후 팝업 표시
    document.addEventListener("DOMContentLoaded", () => {
      const popupSeen = this.getCookie("popupSeen");
      if (popupSeen !== "true" && this.popup) {
        this.showPopup();
      }
    });
  }
}
