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
} from "./audio.js";

import {
  startAuroraAnimation,
  stopAuroraAnimation,
  setIsSoundPlaying,
} from "./aurorawaves.js";

import { setStarExcitement } from "./starfield.js";

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
  });

  increaseOctaveButton.addEventListener("click", () => {
    const newFrequencies = shiftOctave(1);
    updateToneButtons(newFrequencies);
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

    button.addEventListener("mousedown", playChordHandler);
    button.addEventListener("mouseup", stopChordHandler);
    button.addEventListener("mouseleave", stopChordHandler);

    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      playChordHandler();
    });
    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      stopChordHandler();
    });
  });

  document.querySelectorAll(".tone-select-button").forEach((button) => {
    button.addEventListener("click", () => {
      const toneCount = parseInt(button.dataset.tones);
      setToneCount(toneCount);
      updateToneButtons(chords[toneCount][currentChord]);

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

  document.body.addEventListener("click", function () {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  });
}

export { initializeUI };
