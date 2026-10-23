import './style.css';
import { audioEngine } from './audio.js';

// Application State
const appState = {
  tasks: JSON.parse(localStorage.getItem('stepforge_tasks') || '[]'),
  activeTaskIndex: null,
  activeStepIndex: 0,
  bionicReading: false,
  dyslexicFont: false,
  theme: 'dark'
};

function generateFallbackSteps(taskTitle) {
  return [
    `Set up workspace and open relevant files for: ${taskTitle}`,
    'Write down the basic framework or first outline item',
    'Spend 10 minutes working on the highest priority part',
    'Review what you built and make minor refinements',
    'Finalize work and mark project as completed'
  ];
}

// Grok API Integration
async function generateGrokSteps(taskTitle) {
  const apiKey = localStorage.getItem('grok_api_key')?.trim() || 'YOUR_GROK_API_KEY_HERE';

  if (!apiKey || apiKey === 'YOUR_GROK_API_KEY_HERE') {
    return generateFallbackSteps(taskTitle);
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content:
              'You are an executive function coach specialized in accessibility. Break down the user goal into 4 to 6 short, concrete, low-effort micro-steps. Return ONLY a JSON array of strings, e.g., ["Step 1", "Step 2"].'
          },
          {
            role: 'user',
            content: taskTitle
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '[]';
    const cleanJson = content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return Array.isArray(parsed) ? parsed : generateFallbackSteps(taskTitle);
  } catch (error) {
    console.error('Error connecting to Grok API, using fallback:', error);
    return [
      `Set up workspace for: ${taskTitle}`,
      'Outline initial thoughts',
      'Complete first focus block',
      'Review and finalize'
    ];
  }
}

// Bionic Reading Converter
function applyBionic(text) {
  if (!appState.bionicReading) return text;

  return text
    .split(' ')
    .map((word) => {
      if (word.length <= 3) {
        return `<span class="bionic-bold">${word.slice(0, 1)}</span>${word.slice(1)}`;
      }

      const mid = Math.ceil(word.length / 2);
      return `<span class="bionic-bold">${word.slice(0, mid)}</span>${word.slice(mid)}`;
    })
    .join(' ');
}

// Render Engine
function render() {
  const app = document.getElementById('app');
  document.body.className = `theme-${appState.theme} ${appState.dyslexicFont ? 'dyslexic-font' : ''}`;

  if (appState.activeTaskIndex !== null) {
    renderFocusMode(app);
  } else {
    renderDashboard(app);
  }
}

function renderDashboard(container) {
  const currentKey = localStorage.getItem('grok_api_key') || '';

  container.innerHTML = `
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header class="mb-10 flex flex-col gap-6 border-b border-slate-700/50 pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="brand-mark flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-black" aria-hidden="true">S</div>
          <div>
            <p class="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Make room to begin</p>
            <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">StepForge</h1>
            <p class="mt-1 text-sm text-slate-300">A calmer way to turn big goals into small starts.</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="toggleTheme" class="surface-control rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-slate-400 active:scale-[0.98]">Change theme</button>
          <button id="toggleDyslexia" class="surface-control rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-slate-400 active:scale-[0.98]">Dyslexia font</button>
        </div>
      </header>

      <section class="surface-glass mb-6 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center" aria-label="Grok API settings">
        <div class="min-w-0 flex-1">
          <label for="apiKeyInput" class="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-300">Optional · Grok API key</label>
          <input
            id="apiKeyInput"
            type="password"
            value="${currentKey}"
            placeholder="Add a key to generate steps with Grok"
            autocomplete="off"
            class="surface-input w-full rounded-xl border px-3 py-2.5 text-sm"
          />
        </div>
        <button id="saveKeyBtn" class="surface-control rounded-xl border px-4 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:border-slate-400 active:scale-[0.98]">Save key</button>
      </section>

      <section class="hero-panel surface-glass relative mb-12 overflow-hidden rounded-3xl border p-6 shadow-2xl sm:p-9">
        <div class="hero-glow pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full" aria-hidden="true"></div>
        <div class="relative">
          <span class="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">
            <span class="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true"></span>
            One small step is enough
          </span>
          <label for="taskInput" class="mb-2 block text-2xl font-bold tracking-tight sm:text-3xl">What feels like a lot right now?</label>
          <p class="mb-6 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Name the goal. We’ll help you find a gentle, doable place to start.</p>
        </div>
        <div class="relative flex flex-col gap-3 sm:flex-row">
          <input
            id="taskInput"
            type="text"
            placeholder="e.g. Prepare for a presentation"
            class="surface-input min-w-0 flex-1 rounded-xl border px-4 py-3.5 text-base"
          />
          <button id="micBtn" type="button" title="Voice input" aria-label="Enter a goal using voice" class="surface-control rounded-xl border px-5 py-3.5 text-lg transition-all hover:-translate-y-0.5 hover:border-slate-400 active:scale-[0.98]">🎙️</button>
        </div>
        <button id="breakdownBtn" class="primary-action relative mt-3 w-full rounded-xl px-5 py-4 text-base font-extrabold transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-wait disabled:opacity-90 sm:w-auto sm:min-w-64">
          Break this down
        </button>
      </section>

      <section aria-labelledby="projectsHeading" aria-live="polite">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-300">Your workspace</p>
            <h2 id="projectsHeading" class="text-2xl font-bold tracking-tight">Active projects</h2>
          </div>
          <span class="rounded-full border border-slate-700/70 bg-slate-800/50 px-3 py-1 text-xs font-semibold text-slate-300">${appState.tasks.length} ${appState.tasks.length === 1 ? 'project' : 'projects'}</span>
        </div>
        ${appState.tasks.length === 0 ? `
          <div class="surface-glass empty-state rounded-3xl border px-6 py-12 text-center sm:py-16">
            <div class="empty-icon mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl" aria-hidden="true">✦</div>
            <h3 class="mb-2 text-lg font-bold">Your next step starts here</h3>
            <p class="mx-auto max-w-sm text-sm leading-6 text-slate-300">Add one thing on your mind. There’s no need to have the whole plan figured out yet.</p>
          </div>
        ` : ''}
        <div class="space-y-4">
          ${appState.tasks
            .map(
              (t, idx) => {
                const completed = t.steps.filter((s) => s.done).length;
                const progress = t.steps.length ? Math.round((completed / t.steps.length) * 100) : 0;
                return `
                <article class="surface-glass project-card rounded-2xl border p-5 sm:p-6">
                  <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div class="min-w-0 flex-1">
                      <h3 class="break-words text-lg font-bold">${t.title}</h3>
                      <p class="mt-1 text-sm text-slate-300">${completed} of ${t.steps.length} steps complete</p>
                      <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/50" role="progressbar" aria-label="Project progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}">
                        <div class="progress-fill h-full rounded-full transition-all duration-700" style="width: ${progress}%"></div>
                      </div>
                    </div>
                    <button onclick="startFocus(${idx})" class="project-action shrink-0 rounded-xl px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                      Start focus <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </article>
              `;
              }
            )
            .join('')}
        </div>
      </section>
    </div>
  `;

  bindDashboardEvents();
}

function renderFocusMode(container) {
  const task = appState.tasks[appState.activeTaskIndex];
  const step = task.steps[appState.activeStepIndex];
  const progress = Math.round(((appState.activeStepIndex + 1) / task.steps.length) * 100);

  container.innerHTML = `
    <div class="focus-shell mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-5 sm:px-8 sm:py-8">
      <header class="surface-glass rounded-2xl border p-4 sm:p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <button id="exitFocus" class="surface-control rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:border-slate-400 active:scale-[0.98]">← <span class="hidden sm:inline">Back to projects</span><span class="sm:hidden">Exit</span></button>
          <span class="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-200">Focus session</span>
          <button id="toggleBionic" class="surface-control rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:border-slate-400 active:scale-[0.98]">
          ${appState.bionicReading ? 'Disable Bionic' : 'Enable Bionic'}
          </button>
        </div>
        <div class="mt-5 flex items-center justify-between text-sm">
          <span class="font-semibold text-slate-200">Step ${appState.activeStepIndex + 1} <span class="font-normal text-slate-400">of ${task.steps.length}</span></span>
          <span class="font-semibold text-slate-300">${progress}%</span>
        </div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-950/50" role="progressbar" aria-label="Task progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}">
          <div class="progress-fill h-full rounded-full transition-all duration-700" style="width: ${progress}%"></div>
        </div>
      </header>

      <main class="focus-content my-auto py-12 text-center" aria-live="assertive">
        <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">You’re working on</p>
        <h1 class="mx-auto mb-10 max-w-2xl text-base font-semibold text-slate-300">${task.title}</h1>
        <div class="surface-glass mx-auto mb-8 max-w-3xl rounded-3xl border px-6 py-10 text-2xl font-bold leading-relaxed shadow-2xl sm:px-12 sm:py-14 sm:text-4xl">
          ${applyBionic(step.text)}
        </div>

        <div class="flex flex-col justify-center gap-3 sm:flex-row">
          <button id="speakStep" class="surface-control inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold transition-all hover:-translate-y-0.5 hover:border-slate-400 active:scale-[0.98]">
            <span aria-hidden="true">🔊</span> Read aloud
          </button>
          <button id="completeStep" class="complete-action rounded-xl px-7 py-3.5 text-base font-extrabold transition-all hover:-translate-y-0.5 active:scale-[0.98]">
            ${appState.activeStepIndex === task.steps.length - 1 ? 'Finish task 🎉' : 'Complete step →'}
          </button>
        </div>
      </main>

      <footer class="surface-glass flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm font-bold">Calm audio</span>
          <button id="toggleSound" class="surface-control rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:border-slate-400 active:scale-[0.98]">
            ${audioEngine.isPlaying ? 'Stop Brown Noise' : 'Play Brown Noise'}
          </button>
        </div>
        <p class="text-xs text-slate-400">One thing at a time. You’re doing great.</p>
      </footer>
    </div>
  `;

  bindFocusEvents();
}

function bindDashboardEvents() {
  document.getElementById('toggleTheme')?.addEventListener('click', () => {
    const themes = ['dark', 'calm', 'light'];
    appState.theme = themes[(themes.indexOf(appState.theme) + 1) % themes.length];
    render();
  });

  document.getElementById('toggleDyslexia')?.addEventListener('click', () => {
    appState.dyslexicFont = !appState.dyslexicFont;
    render();
  });

  document.getElementById('saveKeyBtn')?.addEventListener('click', () => {
    const keyVal = document.getElementById('apiKeyInput').value.trim();
    localStorage.setItem('grok_api_key', keyVal);
    alert('Grok API Key saved locally!');
  });

  document.getElementById('breakdownBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('taskInput');
    const taskTitle = input.value.trim();
    if (!taskTitle) return;

    const btn = document.getElementById('breakdownBtn');
    btn.textContent = 'Grok is breaking down your task...';
    btn.disabled = true;

    const rawSteps = await generateGrokSteps(taskTitle);
    const steps = rawSteps.map((text) => ({ text, done: false }));

    appState.tasks.push({ title: taskTitle, steps });
    localStorage.setItem('stepforge_tasks', JSON.stringify(appState.tasks));
    input.value = '';
    render();
  });

  document.getElementById('micBtn')?.addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
      document.getElementById('taskInput').value = event.results[0][0].transcript;
    };

    recognition.start();
  });
}

function bindFocusEvents() {
  document.getElementById('exitFocus')?.addEventListener('click', () => {
    appState.activeTaskIndex = null;
    audioEngine.stop();
    render();
  });

  document.getElementById('toggleBionic')?.addEventListener('click', () => {
    appState.bionicReading = !appState.bionicReading;
    render();
  });

  document.getElementById('speakStep')?.addEventListener('click', () => {
    const task = appState.tasks[appState.activeTaskIndex];
    const text = task.steps[appState.activeStepIndex].text;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  });

  document.getElementById('completeStep')?.addEventListener('click', () => {
    const task = appState.tasks[appState.activeTaskIndex];
    task.steps[appState.activeStepIndex].done = true;
    localStorage.setItem('stepforge_tasks', JSON.stringify(appState.tasks));

    if (appState.activeStepIndex < task.steps.length - 1) {
      appState.activeStepIndex += 1;
    } else {
      alert('Task completed! Great job focusing!');
      appState.activeTaskIndex = null;
    }
    render();
  });

  document.getElementById('toggleSound')?.addEventListener('click', () => {
    if (audioEngine.isPlaying) {
      audioEngine.stop();
    } else {
      audioEngine.start('brown');
    }
    render();
  });
}

window.startFocus = (index) => {
  appState.activeTaskIndex = index;
  appState.activeStepIndex = 0;
  render();
};

render();
