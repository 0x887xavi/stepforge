# ⚡ StepForge
> Accessible micro-tasker and executive function companion built for the Taskforge Hackathon.

![StepForge Banner](https://img.shields.io/badge/Accessibility-WCAG%20AA-emerald) ![Tech Stack](https://img.shields.io/badge/Stack-Vite%20%7C%20Tailwind%20%7C%20Grok%20API-indigo) ![License](https://img.shields.io/badge/License-MIT-blue)

---

##  Inspiration & The Problem
Individuals with ADHD, dyslexia, and executive dysfunction often experience intense "task paralysis" when confronted with large, ambiguous, or complex goals (e.g., *"Write research paper"* or *"Clean the house"*). Dense text walls and cluttered UIs create massive cognitive overload.

StepForge solves this by bridging AI task decomposition with radical accessibility. It strips away visual clutter, isolates a single micro-step at a time, and provides multi-sensory support to help users cross the finish line.

---

##  Key Accessible Features

- AI-Powered Task Breakdown: Integrates the xAI Grok API to automatically slice intimidating goals into 4–6 concrete, low-effort micro-steps. Includes offline fallback support.
- Single-Task Focus Mode: Completely eliminates distraction by displaying *only one step at a time* on screen.
- Bionic Reading Engine: Bolds initial word prefixes to guide natural eye movement and boost reading speed/comprehension.
- Cognitive Audio Soundscapes: Built-in Web Audio API generator providing soothing brown noise to anchor focus without external file dependencies.
- Multi-Modal Accessibility: 
  - Dyslexia-friendly font toggle (Atkinson Hyperlegible).
  - High-contrast color themes (Dark, Calm Pastel, Light).
  - Native Web Speech API text-to-speech (TTS) and voice recognition input.
  - Full keyboard accessibility and ARIA live regions.

---

##  Tech Stack

* Frontend: Vanilla JavaScript (ES6+), Vite, HTML5
* Styling: Tailwind CSS, Custom Glassmorphism UI
* AI Engine: xAI Grok API (grok-beta)
* Browser APIs: Web Audio API, Web Speech API (SpeechRecognition & SpeechSynthesis), LocalStorage

---

##  Getting Started Locally

Follow these steps to run StepForge on your local machine:

### 1. Clone the repository
`bash
git clone [https://github.com/YOUR_USERNAME/stepforge.git](https://github.com/YOUR_USERNAME/stepforge.git)
cd stepforge
