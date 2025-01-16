export function createBackgroundAnimation(
  selector: string,
  size: number,
  duration: string,
  link: string,
  effect: "scale" | "rotate" | "opacity" | "skew"
) {
  const element = document.querySelector(selector);

  if (!element) {
    console.error(`Element with selector '${selector}' not found.`);
    return;
  }

  // 효과에 따른 애니메이션 설정
  let animationKeyframes = "";

  switch (effect) {
    case "scale":
      animationKeyframes = `
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
        `;
      break;
    case "rotate":
      animationKeyframes = `
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
        `;
      break;
    case "opacity":
      animationKeyframes = `
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        `;
      break;
    case "skew":
      animationKeyframes = `
          0%, 100% {
            transform: skew(0deg, 0deg);
          }
          50% {
            transform: skew(20deg, 10deg);
          }
        `;
      break;
    default:
      animationKeyframes = "";
  }

  // 고유한 애니메이션 이름 생성
  const animationName = `effect_${effect}_${link}`;

  // 스타일 태그 생성 및 추가
  const styleElement = document.createElement("style");
  styleElement.textContent = `
      @keyframes ${animationName} {
        ${animationKeyframes}
      }
  
      ${selector}::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transform-origin: center;
        width: ${size}px;
        height: ${size}px;
        background: url("../../public/images/bg/${link}.png") no-repeat center / contain;
        animation: ${animationName} ${duration} infinite ease-in-out;
      }
    `;
  document.head.appendChild(styleElement);
}
