(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const t of n)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function o(n){const t={};return n.integrity&&(t.integrity=n.integrity),n.referrerPolicy&&(t.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?t.credentials="include":n.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function l(n){if(n.ep)return;n.ep=!0;const t=o(n);fetch(n.href,t)}})();class f{constructor(){this.ctx=null,this.noiseNode=null,this.gainNode=null,this.isPlaying=!1}init(){if(!this.ctx){const s=window.AudioContext||window.webkitAudioContext;this.ctx=new s}}start(s="brown"){this.init(),this.ctx.state==="suspended"&&this.ctx.resume(),this.isPlaying&&this.stop();const o=this.ctx.sampleRate*2,l=this.ctx.createBuffer(1,o,this.ctx.sampleRate),n=l.getChannelData(0);let t=0;for(let i=0;i<o;i++){const r=Math.random()*2-1;s==="brown"?(n[i]=(t+.02*r)/1.02,t=n[i],n[i]*=3.5):n[i]=r*.1}this.noiseNode=this.ctx.createBufferSource(),this.noiseNode.buffer=l,this.noiseNode.loop=!0,this.gainNode=this.ctx.createGain(),this.gainNode.gain.setValueAtTime(.15,this.ctx.currentTime),this.noiseNode.connect(this.gainNode),this.gainNode.connect(this.ctx.destination),this.noiseNode.start(),this.isPlaying=!0}stop(){this.noiseNode&&(this.noiseNode.stop(),this.noiseNode.disconnect(),this.noiseNode=null),this.isPlaying=!1}setVolume(s){this.gainNode&&this.ctx&&this.gainNode.gain.setValueAtTime(s,this.ctx.currentTime)}}const d=new f,e={tasks:JSON.parse(localStorage.getItem("stepforge_tasks")||"[]"),activeTaskIndex:null,activeStepIndex:0,bionicReading:!1,dyslexicFont:!1,theme:"dark"};function m(a){return[`Set up workspace and open relevant files for: ${a}`,"Write down the basic framework or first outline item","Spend 10 minutes working on the highest priority part","Review what you built and make minor refinements","Finalize work and mark project as completed"]}async function g(a){var o,l,n,t;const s=((o=localStorage.getItem("grok_api_key"))==null?void 0:o.trim())||"YOUR_GROK_API_KEY_HERE";if(s==="YOUR_GROK_API_KEY_HERE")return m(a);try{const r=await(await fetch("https://api.x.ai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify({model:"grok-beta",messages:[{role:"system",content:'You are an executive function coach specialized in accessibility. Break down the user goal into 4 to 6 short, concrete, low-effort micro-steps. Return ONLY a JSON array of strings, e.g., ["Step 1", "Step 2"].'},{role:"user",content:a}],temperature:.7})})).json(),u=(((t=(n=(l=r==null?void 0:r.choices)==null?void 0:l[0])==null?void 0:n.message)==null?void 0:t.content)||"[]").replace(/```json|```/g,"").trim(),p=JSON.parse(u);return Array.isArray(p)?p:m(a)}catch(i){return console.error("Error connecting to Grok API, using fallback:",i),[`Set up workspace for: ${a}`,"Outline initial thoughts","Complete first focus block","Review and finalize"]}}function b(a){return e.bionicReading?a.split(" ").map(s=>{if(s.length<=3)return`<span class="bionic-bold">${s.slice(0,1)}</span>${s.slice(1)}`;const o=Math.ceil(s.length/2);return`<span class="bionic-bold">${s.slice(0,o)}</span>${s.slice(o)}`}).join(" "):a}function c(){const a=document.getElementById("app");document.body.className=`theme-${e.theme} ${e.dyslexicFont?"dyslexic-font":""}`,e.activeTaskIndex!==null?v(a):h(a)}function h(a){const s=localStorage.getItem("grok_api_key")||"";a.innerHTML=`
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
            value="${s}"
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
          <span class="rounded-full border border-slate-700/70 bg-slate-800/50 px-3 py-1 text-xs font-semibold text-slate-300">${e.tasks.length} ${e.tasks.length===1?"project":"projects"}</span>
        </div>
        ${e.tasks.length===0?`
          <div class="surface-glass empty-state rounded-3xl border px-6 py-12 text-center sm:py-16">
            <div class="empty-icon mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl" aria-hidden="true">✦</div>
            <h3 class="mb-2 text-lg font-bold">Your next step starts here</h3>
            <p class="mx-auto max-w-sm text-sm leading-6 text-slate-300">Add one thing on your mind. There’s no need to have the whole plan figured out yet.</p>
          </div>
        `:""}
        <div class="space-y-4">
          ${e.tasks.map((o,l)=>{const n=o.steps.filter(i=>i.done).length,t=o.steps.length?Math.round(n/o.steps.length*100):0;return`
                <article class="surface-glass project-card rounded-2xl border p-5 sm:p-6">
                  <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div class="min-w-0 flex-1">
                      <h3 class="break-words text-lg font-bold">${o.title}</h3>
                      <p class="mt-1 text-sm text-slate-300">${n} of ${o.steps.length} steps complete</p>
                      <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/50" role="progressbar" aria-label="Project progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${t}">
                        <div class="progress-fill h-full rounded-full transition-all duration-700" style="width: ${t}%"></div>
                      </div>
                    </div>
                    <button onclick="startFocus(${l})" class="project-action shrink-0 rounded-xl px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                      Start focus <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </article>
              `}).join("")}
        </div>
      </section>
    </div>
  `,y()}function v(a){const s=e.tasks[e.activeTaskIndex],o=s.steps[e.activeStepIndex],l=Math.round((e.activeStepIndex+1)/s.steps.length*100);a.innerHTML=`
    <div class="focus-shell mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-5 sm:px-8 sm:py-8">
      <header class="surface-glass rounded-2xl border p-4 sm:p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <button id="exitFocus" class="surface-control rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:border-slate-400 active:scale-[0.98]">← <span class="hidden sm:inline">Back to projects</span><span class="sm:hidden">Exit</span></button>
          <span class="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-200">Focus session</span>
          <button id="toggleBionic" class="surface-control rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all hover:border-slate-400 active:scale-[0.98]">
          ${e.bionicReading?"Disable Bionic":"Enable Bionic"}
          </button>
        </div>
        <div class="mt-5 flex items-center justify-between text-sm">
          <span class="font-semibold text-slate-200">Step ${e.activeStepIndex+1} <span class="font-normal text-slate-400">of ${s.steps.length}</span></span>
          <span class="font-semibold text-slate-300">${l}%</span>
        </div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-950/50" role="progressbar" aria-label="Task progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${l}">
          <div class="progress-fill h-full rounded-full transition-all duration-700" style="width: ${l}%"></div>
        </div>
      </header>

      <main class="focus-content my-auto py-12 text-center" aria-live="assertive">
        <p class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">You’re working on</p>
        <h1 class="mx-auto mb-10 max-w-2xl text-base font-semibold text-slate-300">${s.title}</h1>
        <div class="surface-glass mx-auto mb-8 max-w-3xl rounded-3xl border px-6 py-10 text-2xl font-bold leading-relaxed shadow-2xl sm:px-12 sm:py-14 sm:text-4xl">
          ${b(o.text)}
        </div>

        <div class="flex flex-col justify-center gap-3 sm:flex-row">
          <button id="speakStep" class="surface-control inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold transition-all hover:-translate-y-0.5 hover:border-slate-400 active:scale-[0.98]">
            <span aria-hidden="true">🔊</span> Read aloud
          </button>
          <button id="completeStep" class="complete-action rounded-xl px-7 py-3.5 text-base font-extrabold transition-all hover:-translate-y-0.5 active:scale-[0.98]">
            ${e.activeStepIndex===s.steps.length-1?"Finish task 🎉":"Complete step →"}
          </button>
        </div>
      </main>

      <footer class="surface-glass flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm font-bold">Calm audio</span>
          <button id="toggleSound" class="surface-control rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:border-slate-400 active:scale-[0.98]">
            ${d.isPlaying?"Stop Brown Noise":"Play Brown Noise"}
          </button>
        </div>
        <p class="text-xs text-slate-400">One thing at a time. You’re doing great.</p>
      </footer>
    </div>
  `,k()}function y(){var a,s,o,l,n;(a=document.getElementById("toggleTheme"))==null||a.addEventListener("click",()=>{const t=["dark","calm","light"];e.theme=t[(t.indexOf(e.theme)+1)%t.length],c()}),(s=document.getElementById("toggleDyslexia"))==null||s.addEventListener("click",()=>{e.dyslexicFont=!e.dyslexicFont,c()}),(o=document.getElementById("saveKeyBtn"))==null||o.addEventListener("click",()=>{const t=document.getElementById("apiKeyInput").value.trim();localStorage.setItem("grok_api_key",t),alert("Grok API Key saved locally!")}),(l=document.getElementById("breakdownBtn"))==null||l.addEventListener("click",async()=>{const t=document.getElementById("taskInput"),i=t.value.trim();if(!i)return;const r=document.getElementById("breakdownBtn");r.textContent="Grok is breaking down your task...",r.disabled=!0;const u=(await g(i)).map(p=>({text:p,done:!1}));e.tasks.push({title:i,steps:u}),localStorage.setItem("stepforge_tasks",JSON.stringify(e.tasks)),t.value="",c()}),(n=document.getElementById("micBtn"))==null||n.addEventListener("click",()=>{if(!("webkitSpeechRecognition"in window)&&!("SpeechRecognition"in window)){alert("Speech recognition is not supported in this browser.");return}const t=window.SpeechRecognition||window.webkitSpeechRecognition,i=new t;i.onresult=r=>{document.getElementById("taskInput").value=r.results[0][0].transcript},i.start()})}function k(){var a,s,o,l,n;(a=document.getElementById("exitFocus"))==null||a.addEventListener("click",()=>{e.activeTaskIndex=null,d.stop(),c()}),(s=document.getElementById("toggleBionic"))==null||s.addEventListener("click",()=>{e.bionicReading=!e.bionicReading,c()}),(o=document.getElementById("speakStep"))==null||o.addEventListener("click",()=>{const i=e.tasks[e.activeTaskIndex].steps[e.activeStepIndex].text,r=new SpeechSynthesisUtterance(i);window.speechSynthesis.speak(r)}),(l=document.getElementById("completeStep"))==null||l.addEventListener("click",()=>{const t=e.tasks[e.activeTaskIndex];t.steps[e.activeStepIndex].done=!0,localStorage.setItem("stepforge_tasks",JSON.stringify(e.tasks)),e.activeStepIndex<t.steps.length-1?e.activeStepIndex+=1:(alert("Task completed! Great job focusing!"),e.activeTaskIndex=null),c()}),(n=document.getElementById("toggleSound"))==null||n.addEventListener("click",()=>{d.isPlaying?d.stop():d.start("brown"),c()})}window.startFocus=a=>{e.activeTaskIndex=a,e.activeStepIndex=0,c()};c();
