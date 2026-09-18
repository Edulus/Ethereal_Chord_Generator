let animationFrameId;
let waveSpeed = 0;
let time = 0;
const decelerationRate = 0.99;
let isSoundPlaying = false;
let soundStartTime = 0;
let resizeListenerAdded = false;

// Wave speed while sound plays: starts at BASE and keeps rising the longer
// the sound is held or sustained, up to MAX (pixels per frame).
const BASE_WAVE_SPEED = 2;
const WAVE_SPEED_PER_SECOND = 1.5;
const MAX_WAVE_SPEED = 15;

// Each chord has its own palette; the tone count picks how many of its
// colors (wave layers) are shown. Values are [hue, saturation %, lightness %].
const palettes = {
  "Celestial Whisper": [
    [200, 80, 70],
    [220, 70, 65],
    [240, 60, 75],
    [190, 60, 80],
    [260, 50, 70],
  ],
  "Ethereal Dream": [
    [320, 70, 70],
    [280, 60, 70],
    [160, 60, 70],
    [340, 70, 75],
    [200, 60, 75],
  ],
  "Mystic Voyage": [
    [180, 80, 35],
    [220, 70, 40],
    [260, 70, 40],
    [200, 80, 30],
    [290, 60, 35],
  ],
  "Harmonic Cascade": [
    [170, 80, 45],
    [150, 70, 45],
    [190, 80, 50],
    [130, 60, 45],
    [200, 70, 55],
  ],
  "Sonic Aurora": [
    [140, 90, 50],
    [120, 80, 45],
    [170, 90, 50],
    [300, 80, 55],
    [100, 80, 50],
  ],
  "Quantum Resonance": [
    [190, 100, 50],
    [270, 100, 55],
    [310, 100, 55],
    [220, 100, 55],
    [160, 100, 50],
  ],
  "Nebula's Echo": [
    [330, 90, 50],
    [350, 85, 50],
    [290, 70, 45],
    [20, 90, 55],
    [260, 70, 45],
  ],
  "Astral Pulse": [
    [45, 100, 55],
    [30, 100, 50],
    [55, 100, 60],
    [15, 90, 50],
    [60, 80, 70],
  ],
  "Cosmic Harmony": [
    [0, 90, 55],
    [60, 90, 55],
    [120, 90, 50],
    [200, 90, 55],
    [280, 90, 55],
  ],
};

let colors = [];

function setAuroraChord(chordName, layerCount) {
  colors = palettes[chordName]
    .slice(0, layerCount)
    .map(([h, s, l]) => `hsla(${h}, ${s}%, ${l}%, 0.3)`);
}

function startAuroraAnimation(chordName, layerCount) {
  const canvas = document.getElementById("aurora-background");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Called on every chord press: register the listener once and cancel any
  // previous loop so only one animation loop ever runs.
  if (!resizeListenerAdded) {
    window.addEventListener("resize", resizeCanvas);
    resizeListenerAdded = true;
  }
  resizeCanvas();
  stopAuroraAnimation();

  setAuroraChord(chordName, layerCount);

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
      const secondsPlaying = (performance.now() - soundStartTime) / 1000;
      const targetSpeed = Math.min(
        BASE_WAVE_SPEED + WAVE_SPEED_PER_SECOND * secondsPlaying,
        MAX_WAVE_SPEED
      );
      waveSpeed += (targetSpeed - waveSpeed) * 0.1; // Ease toward the target
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

// Each new chord or tone restarts the clock that drives wave speed.
function setIsSoundPlaying(isPlaying) {
  if (isPlaying) soundStartTime = performance.now();
  isSoundPlaying = isPlaying;
}

export {
  startAuroraAnimation,
  stopAuroraAnimation,
  setAuroraChord,
  setIsSoundPlaying,
};
