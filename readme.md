# Ethereal Chord Generator

Live: https://edulus.github.io/Ethereal_Chord_Generator/

## Overview
The Ethereal Chord Generator is an interactive web application that allows users to explore and play with various chord configurations. This project is a fork of the original Seven Chords and Tones Experience, expanding its capabilities to include variable chord sizes and enhanced interactivity.

## Features
- Nine chords: Celestial Whisper, Ethereal Dream, Mystic Voyage, Harmonic Cascade, Sonic Aurora, Quantum Resonance, Nebula's Echo, Astral Pulse, and Cosmic Harmony
- Adjustable chord sizes: 3, 4, or 5 tones
- Octave shift (-/+), up to three octaves either way
- Double-click or double-tap a chord to sustain it
- Interactive tone buttons that play individual frequencies
- Visual representation of tones with color-coded buttons
- Responsive design for both desktop and mobile devices
- Audio visualization with aurora-like animation and starfield background

## Technical Details
- Built with vanilla JavaScript, HTML5, and CSS3
- Utilizes the Web Audio API for sound generation
- Implements HTML5 Canvas for visual effects

## Project Structure
```
index.html
├── styles.css
├── audio.js         # chords, oscillators, octave shift
├── aurorawaves.js   # wave animation behind the chords
├── starfield.js     # star background
└── ui.js            # buttons, sustain, wiring
```

## How to Use
1. Serve the folder over HTTP (the scripts are ES modules, so opening `index.html` directly from disk won't load them), e.g. `python -m http.server`
2. Press and hold a chord square to play it; release to stop
3. Double-click or double-tap a chord square to sustain it; press it again, another chord, or a tone to stop
4. Press and hold a tone circle to play that single note
5. Use 3, 4, or 5 Tones to change the chord size, and - / + to shift octaves

## Development
To modify or extend this project:
1. Clone the repository
2. Make changes to the relevant JavaScript files (audio.js, aurorawaves.js, starfield.js, ui.js)
3. Update styles in styles.css as needed
4. Test your changes by serving the folder locally (see How to Use)
5. Pushing to `main` deploys to GitHub Pages

## Contributing
Contributions to the Multi-Tonal Chord Generator are welcome. Please fork the repository and submit a pull request with your proposed changes.

## License
[Insert appropriate license information here]

## Acknowledgments
This project is a fork of the original Seven Chords and Tones Experience. We appreciate the foundation provided by the original creators.