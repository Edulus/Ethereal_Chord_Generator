import { frequencyToHue } from "./audio.js";

let animationFrameId;
let waveSpeed = 0;
let time = 0;
const decelerationRate = 0.99;
let isSoundPlaying = false;

function startAuroraAnimation(frequencies) {
  const canvas = document.getElementById("aurora-background");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const colors = frequencies.map(
    (freq) => `hsla(${frequencyToHue(freq)}, 100%, 50%, 0.3)`
  );

  function drawAurora() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < colors.length; i++) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x < canvas.width; x++) {
        const y =
          Math.sin((x + time) / 50) * 35 + Math.sin((x + time) / 25) * 17.5;
        ctx.lineTo(
          x,
          canvas.height - y - i * ((canvas.height * 0.7) / colors.length)
        );
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();

      ctx.fillStyle = colors[i];
      ctx.fill();
    }

    if (isSoundPlaying) {
      waveSpeed = Math.min(waveSpeed + 0.1, 3); // Accelerate to a max speed of 3
    } else {
      waveSpeed = Math.max(waveSpeed * decelerationRate, 0); // Decelerate to a stop
    }

    time += waveSpeed;

    animationFrameId = requestAnimationFrame(drawAurora);
  }

  drawAurora();
}

function stopAuroraAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
}

function setIsSoundPlaying(isPlaying) {
  isSoundPlaying = isPlaying;
}

export { startAuroraAnimation, stopAuroraAnimation, setIsSoundPlaying };
