function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArr = decodedCookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookie = cookieArr[i].trim();
    if (cookie.indexOf(name + "=") === 0) {
      return cookie.substring(name.length + 1);
    }
  }
  return "";
}

function showPopup() {
  const popup = document.getElementById("popup");
  const closeBtn = document.querySelector(".close-btn");
  const dontShowAgainCheckbox = document.getElementById(
    "dontShowAgainCheckbox"
  );
  const okBtn = document.getElementById("okBtn");

  popup.style.display = "flex";

  okBtn.onclick = function () {
    if (dontShowAgainCheckbox.checked) {
      setCookie("popupSeen", "true", 7);
    }
    popup.style.display = "none";
  };

  closeBtn.onclick = function () {
    popup.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  };
}

window.onload = function () {
  const popupSeen = getCookie("popupSeen");
  if (popupSeen !== "true") {
    showPopup();
  }
};
