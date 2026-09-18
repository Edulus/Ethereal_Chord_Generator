import {
  playChord,
  stopChord,
  playTone,
  stopTone,
  frequencyToNote,
  frequencyToHue,
  chords,
  currentChord,
  setToneCount,
  currentToneCount,
  shiftOctave,
  getCurrentFrequencies,
  resumeAudio,
} from "./audio.js";

import {
  startAuroraAnimation,
  stopAuroraAnimation,
  setIsSoundPlaying,
} from "./aurorawaves.js";

import { setStarExcitement } from "./starfield.js";

// A double-click/double-tap on a chord square latches it so it keeps playing
// after release. Pressing it again, another chord, or a tone ends the latch.
const DOUBLE_PRESS_MS = 350;
let sustainedButton = null;
let lastPress = { button: null, time: 0 };

function releaseSustain() {
  if (!sustainedButton) return;
  sustainedButton.classList.remove("spinning");
  sustainedButton = null;
}

// Re-pitch a sustained chord after an octave or tone-count change.
function retriggerSustained() {
  if (!sustainedButton) return;
  startAuroraAnimation(playChord(currentChord));
}

function updateToneButtons(frequencies) {
  const toneContainer = document.getElementById("toneContainer");
  toneContainer.innerHTML = "";

  frequencies.forEach((freq) => {
    const button = document.createElement("button");
    button.className = "tone-button";
    const hue = frequencyToHue(freq);
    button.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
    button.dataset.frequency = freq;
    button.textContent = frequencyToNote(freq);

    let isPlaying = false;

    function startTone() {
      if (!isPlaying) {
        releaseSustain();
        playTone(freq);
        setIsSoundPlaying(true);
        setStarExcitement(true);
        isPlaying = true;
      }
    }

    function stopToneIfPlaying() {
      if (isPlaying) {
        stopTone();
        setIsSoundPlaying(false);
        setStarExcitement(false);
        isPlaying = false;
      }
    }

    button.addEventListener("mousedown", startTone);
    button.addEventListener("mouseup", stopToneIfPlaying);
    button.addEventListener("mouseleave", stopToneIfPlaying);
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startTone();
    });
    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      stopToneIfPlaying();
    });
    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      stopToneIfPlaying();
    });

    toneContainer.appendChild(button);
  });
}

function initializeUI() {
  const decreaseOctaveButton = document.getElementById("decrease-octave");
  const increaseOctaveButton = document.getElementById("increase-octave");

  decreaseOctaveButton.addEventListener("click", () => {
    const newFrequencies = shiftOctave(-1);
    updateToneButtons(newFrequencies);
    retriggerSustained();
  });

  increaseOctaveButton.addEventListener("click", () => {
    const newFrequencies = shiftOctave(1);
    updateToneButtons(newFrequencies);
    retriggerSustained();
  });

  document.querySelectorAll(".chord-button").forEach((button) => {
    if (button.classList.contains("empty")) return;

    const chordName = button.textContent;

    function playChordHandler() {
      const frequencies = playChord(chordName);
      updateToneButtons(frequencies);
      startAuroraAnimation(frequencies);
      setIsSoundPlaying(true);
      setStarExcitement(true);
      button.classList.add("spinning");
    }

    function stopChordHandler() {
      stopChord(chordName);
      setIsSoundPlaying(false);
      setStarExcitement(false);
      button.classList.remove("spinning");
    }

    function pressStart() {
      const now = performance.now();
      const isDouble =
        lastPress.button === button && now - lastPress.time < DOUBLE_PRESS_MS;
      lastPress = { button, time: now };

      if (sustainedButton === button) {
        releaseSustain();
        stopChordHandler();
        lastPress = { button: null, time: 0 };
        return;
      }

      releaseSustain();
      playChordHandler();
      if (isDouble) sustainedButton = button;
    }

    function pressEnd() {
      if (sustainedButton === button) return;
      stopChordHandler();
    }

    button.addEventListener("mousedown", pressStart);
    button.addEventListener("mouseup", pressEnd);
    button.addEventListener("mouseleave", pressEnd);

    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      pressStart();
    });
    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      pressEnd();
    });
    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      pressEnd();
    });
  });

  document.querySelectorAll(".tone-select-button").forEach((button) => {
    button.addEventListener("click", () => {
      const toneCount = parseInt(button.dataset.tones);
      setToneCount(toneCount);
      updateToneButtons(getCurrentFrequencies());
      retriggerSustained();

      document.querySelectorAll(".tone-select-button").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");
    });
  });

  updateToneButtons(chords[currentToneCount][currentChord]);
  document
    .querySelector(`.tone-select-button[data-tones="${currentToneCount}"]`)
    .classList.add("active");

  document.body.addEventListener("click", resumeAudio);
}

export { initializeUI };
