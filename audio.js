const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const chords = {
  3: {
    "Celestial Whisper": [261.63, 329.63, 392.0],
    "Ethereal Dream": [293.66, 369.99, 440.0],
    "Mystic Voyage": [329.63, 415.3, 493.88],
    "Harmonic Cascade": [349.23, 440.0, 523.25],
    "Sonic Aurora": [392.0, 493.88, 587.33],
    "Quantum Resonance": [440.0, 554.37, 659.25],
    "Nebula's Echo": [493.88, 622.25, 739.99],
    "Astral Pulse": [523.25, 659.25, 783.99],
    "Cosmic Harmony": [587.33, 739.99, 880.0],
  },
  4: {
    "Celestial Whisper": [261.63, 329.63, 392.0, 523.25],
    "Ethereal Dream": [293.66, 369.99, 440.0, 587.33],
    "Mystic Voyage": [329.63, 415.3, 493.88, 659.25],
    "Harmonic Cascade": [349.23, 440.0, 523.25, 698.46],
    "Sonic Aurora": [392.0, 493.88, 587.33, 783.99],
    "Quantum Resonance": [440.0, 554.37, 659.25, 880.0],
    "Nebula's Echo": [493.88, 622.25, 739.99, 987.77],
    "Astral Pulse": [523.25, 659.25, 783.99, 1046.5],
    "Cosmic Harmony": [587.33, 739.99, 880.0, 1174.66],
  },
  5: {
    "Celestial Whisper": [261.63, 329.63, 392.0, 493.88, 587.33],
    "Ethereal Dream": [293.66, 369.99, 440.0, 554.37, 659.25],
    "Mystic Voyage": [329.63, 415.3, 493.88, 622.25, 739.99],
    "Harmonic Cascade": [349.23, 440.0, 523.25, 659.25, 783.99],
    "Sonic Aurora": [392.0, 493.88, 587.33, 739.99, 880.0],
    "Quantum Resonance": [440.0, 554.37, 659.25, 830.61, 987.77],
    "Nebula's Echo": [493.88, 622.25, 739.99, 932.33, 1108.73],
    "Astral Pulse": [523.25, 659.25, 783.99, 987.77, 1174.66],
    "Cosmic Harmony": [587.33, 739.99, 880.0, 1108.73, 1318.51],
  },
};

const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const activeOscillators = {};
let currentChord = "Celestial Whisper";
let currentToneCount = 5;
let octaveShift = 0;

function createTone(frequency) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return { oscillator, gainNode };
}

function playChord(chordName) {
  stopAllSounds();
  currentChord = chordName;
  const baseFrequencies = chords[currentToneCount][chordName];
  const shiftedFrequencies = baseFrequencies.map(
    (freq) => freq * Math.pow(2, octaveShift)
  );
  activeOscillators[chordName] = shiftedFrequencies.map((freq) => {
    const { oscillator, gainNode } = createTone(freq);
    oscillator.start();
    return { oscillator, gainNode };
  });
  return shiftedFrequencies;
}

function stopChord(chordName) {
  if (!activeOscillators[chordName]) return;

  activeOscillators[chordName].forEach(({ oscillator, gainNode }) => {
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioContext.currentTime + 0.1
    );
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      gainNode.disconnect();
    }, 100);
  });

  delete activeOscillators[chordName];
}

function playTone(frequency) {
  stopAllSounds();
  const shiftedFrequency = frequency * Math.pow(2, octaveShift);
  const { oscillator, gainNode } = createTone(shiftedFrequency);
  oscillator.start();
  activeOscillators["tone"] = [{ oscillator, gainNode }];
}

function stopTone() {
  stopAllSounds();
}

function stopAllSounds() {
  Object.keys(activeOscillators).forEach((key) => {
    activeOscillators[key].forEach(({ oscillator, gainNode }) => {
      gainNode.gain.exponentialRampToValueAtTime(
        0.00001,
        audioContext.currentTime + 0.1
      );
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      }, 100);
    });
    delete activeOscillators[key];
  });
}

function frequencyToNote(frequency) {
  const noteNumber = 12 * (Math.log2(frequency / 440) + 4.75);
  const roundedNoteNumber = Math.round(noteNumber);
  return noteNames[roundedNoteNumber % 12];
}

function frequencyToHue(frequency) {
  const noteNumber = 12 * (Math.log2(frequency / 440) + 4.75);
  return (noteNumber * 30) % 360;
}

function setToneCount(count) {
  currentToneCount = count;
}

function shiftOctave(direction) {
  octaveShift += direction;
  return chords[currentToneCount][currentChord].map(
    (freq) => freq * Math.pow(2, octaveShift)
  );
}

export {
  playChord,
  stopChord,
  playTone,
  stopTone,
  stopAllSounds,
  frequencyToNote,
  frequencyToHue,
  chords,
  currentChord,
  setToneCount,
  currentToneCount,
  shiftOctave,
};
