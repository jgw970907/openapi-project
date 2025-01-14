export class Popup {
    constructor() {
        this.popup = document.getElementById("popup");
        this.closeBtn = document.querySelector(".close-btn"); // 타입 단언
        this.dontShowAgainCheckbox = document.getElementById("dontShowAgainCheckbox"); // 타입 단언
        this.okBtn = document.getElementById("okBtn"); // 타입 단언
        this.initializeEvents();
    }
    setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = "expires=" + d.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/`;
    }
    getCookie(name) {
        const cookieArr = document.cookie.split(";").map((c) => c.trim());
        const cookie = cookieArr.find((c) => c.startsWith(`${name}=`));
        return cookie ? cookie.substring(name.length + 1) : "";
    }
    showPopup() {
        this.popup.style.display = "flex";
    }
    hidePopup() {
        this.popup.style.display = "none";
    }
    initializeEvents() {
        // '확인' 버튼 클릭 이벤트
        this.okBtn.addEventListener("click", () => {
            if (this.dontShowAgainCheckbox.checked) {
                this.setCookie("popupSeen", "true", 7);
            }
            this.hidePopup();
        });
        // 닫기 버튼 클릭 이벤트
        this.closeBtn.addEventListener("click", () => {
            this.hidePopup();
        });
        // 외부 클릭으로 팝업 닫기
        window.addEventListener("click", (event) => {
            if (event.target === this.popup) {
                this.hidePopup();
            }
        });
        // 페이지 로드 시 쿠키 확인 후 팝업 표시
        document.addEventListener("DOMContentLoaded", () => {
            const popupSeen = this.getCookie("popupSeen");
            if (popupSeen !== "true") {
                this.showPopup();
            }
        });
    }
}
//# sourceMappingURL=Popup.js.map