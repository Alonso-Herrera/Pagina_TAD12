/**
 * Asistente IA - TAD 12
 * Powered by Grok (Groq)
 *
 * Este frontend no guarda la API key.
 * La llamada se realiza a la función serverless de Netlify.
 */

const GROK_URL = '/api/grok';
const GROK_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `Eres un asistente experto integrado en la página web del proyecto TAD 12, un análisis integral del mercado laboral de Colombia 2010-2025.

CONTEXTO DEL PROYECTO:
- Período: 2010-2025 (15 años, 180 meses de datos mensuales)
- 13.877 registros de datos en las ocho hojas del Excel consolidado
- Incluye series nacionales, género, ciudades, ocupación, SMLV, pobreza e ingresos

INDICADORES CLAVE:
- TGP (Tasa Global de Participación): proporción de la fuerza de trabajo respecto a la población en edad de trabajar.
- TO (Tasa de Ocupación): proporción de población ocupada.
- TD (Tasa de Desocupación): proporción de desocupados en la fuerza de trabajo.
- TS (Tasa de Subocupación): población con empleo insuficiente.

DATOS DE OCUPACIÓN POR AÑO (Femenino% / Masculino%):
2010: 46.75 / 73.44 | 2011: 47.78 / 74.34 | 2012: 48.94 / 74.6
2013: 48.86 / 74.18 | 2014: 48.94 / 74.18 | 2015: 49.27 / 74.2
2016: 48.6 / 73.3   | 2017: 48.12 / 72.83  | 2018: 47.01 / 72.22
2019: 45.7 / 70.68  | 2020: 38.07 / 63.79  | 2021: 39.99 / 67.18
2022: 44.36 / 69.63 | 2023: 45.86 / 70.37  | 2024: 45.74 / 70.07
2025: 46.74 / 71.43

HALLAZGOS PRINCIPALES:
- Brecha de género en TO: 24.3 puntos porcentuales (Hombres: 71.9% vs Mujeres: 47.5%)
- Caída pronunciada en 2020 por COVID-19, recuperación gradual desde 2021
- Participación laboral femenina en aumento pero aún inferior a la masculina
- Patrones estacionales evidentes en indicadores mensuales

SECCIONES DE LA PÁGINA: Inicio · Análisis Exploratorio · Indicadores Clave · Análisis por Género · Tendencias Temporales · Descargas · Power BI · Equipo

INSTRUCCIONES:
- Responde SIEMPRE en español
- Sé conciso (máximo 4 oraciones salvo que pidan más detalle)
- Usa los datos numéricos concretos cuando sean relevantes
- Si no tienes el dato exacto, sugiere la sección del dashboard donde encontrarlo
- Para preguntas fuera del ámbito del proyecto, puedes responderlas brevemente siendo útil`;

const css = `
    #tad-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: #001F3F; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,31,63,0.4);
      transition: transform 0.18s, box-shadow 0.18s;
    }
    #tad-fab:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(0,31,63,0.5); }
    #tad-fab svg { width: 26px; height: 26px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    #tad-badge {
      position: absolute; top: 0; right: 0;
      width: 13px; height: 13px; background: #22c55e;
      border-radius: 50%; border: 2px solid #fff;
      animation: tad-pulse 2s infinite;
    }
    @keyframes tad-pulse {
      0%,100% { transform: scale(1); } 50% { transform: scale(1.25); }
    }
    #tad-panel {
      position: fixed; bottom: 96px; right: 28px; z-index: 9999;
      width: 360px; height: 520px; background: #fff;
      border-radius: 18px; box-shadow: 0 12px 48px rgba(0,31,63,0.18);
      display: flex; flex-direction: column; overflow: hidden;
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      transition: opacity 0.25s, transform 0.25s;
      border: 1px solid rgba(0,31,63,0.1);
    }
    #tad-panel.tad-hidden { opacity: 0; pointer-events: none; transform: translateY(16px) scale(0.97); }
    #tad-header {
      background: #001F3F; padding: 14px 16px;
      display: flex; align-items: center; gap: 10px;
    }
    #tad-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    #tad-avatar svg { width: 18px; height: 18px; fill: none; stroke: #fff; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    #tad-header-text { flex: 1; }
    #tad-header-text .tad-name { font-size: 14px; font-weight: 600; color: #fff; }
    #tad-header-text .tad-status { font-size: 11px; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
    .tad-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; flex-shrink: 0; }
    #tad-close {
      background: rgba(255,255,255,0.12); border: none; cursor: pointer;
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,0.85); font-size: 16px;
      transition: background 0.15s;
    }
    #tad-close:hover { background: rgba(255,255,255,0.22); color: #fff; }
    #tad-messages {
      flex: 1; overflow-y: auto; padding: 16px 14px 8px;
      display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth;
    }
    #tad-messages::-webkit-scrollbar { width: 3px; }
    #tad-messages::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
    .tad-msg {
      max-width: 87%; padding: 10px 13px; border-radius: 16px;
      font-size: 13.5px; line-height: 1.55; color: #1a1a2e;
      animation: tad-in 0.2s ease;
    }
    @keyframes tad-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
    .tad-msg.bot { background: #f4f6f9; align-self: flex-start; border-bottom-left-radius: 4px; }
    .tad-msg.user { background: #001F3F; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
    #tad-typing {
      display: flex; gap: 5px; align-items: center; padding: 11px 14px;
      background: #f4f6f9; border-radius: 16px; border-bottom-left-radius: 4px;
      align-self: flex-start; animation: tad-in 0.2s ease;
    }
    #tad-typing span {
      width: 7px; height: 7px; border-radius: 50%; background: #9ca3af;
      animation: tad-bounce 1.2s infinite;
    }
    #tad-typing span:nth-child(2) { animation-delay: 0.2s; }
    #tad-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes tad-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
    #tad-chips { padding: 4px 14px 10px; display: flex; flex-wrap: wrap; gap: 6px; }
    .tad-chip {
      font-size: 11.5px; padding: 5px 11px; border-radius: 999px;
      border: 1px solid #d1d5db; background: #fff; color: #374151;
      cursor: pointer; font-family: inherit;
      transition: background 0.12s, border-color 0.12s, color 0.12s;
    }
    .tad-chip:hover { background: #001F3F; border-color: #001F3F; color: #fff; }
    #tad-input-row {
      padding: 10px 12px 12px; border-top: 1px solid #f0f0f0;
      display: flex; gap: 8px; align-items: flex-end;
    }
    #tad-input {
      flex: 1; resize: none; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 9px 12px; font-size: 13px; font-family: inherit;
      color: #1a1a2e; background: #f9fafb; outline: none;
      line-height: 1.45; min-height: 38px; max-height: 90px;
      transition: border-color 0.15s, background 0.15s;
    }
    #tad-input:focus { border-color: #001F3F; background: #fff; }
    #tad-input:disabled { opacity: 0.5; cursor: not-allowed; }
    #tad-send {
      width: 38px; height: 38px; border-radius: 12px; background: #001F3F;
      border: none; cursor: pointer; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
      transition: background 0.12s, transform 0.1s;
    }
    #tad-send:hover { background: #003d66; transform: scale(1.05); }
    #tad-send:active { transform: scale(0.95); }
    #tad-send svg { width: 18px; height: 18px; fill: none; stroke: #fff; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
    #tad-send:disabled { background: #9ca3af; cursor: not-allowed; transform: none; }
    #tad-nokey {
      margin: 12px 14px; padding: 10px 13px;
      background: #fff8e1; border: 1px solid #f59e0b;
      border-radius: 10px; font-size: 12px; color: #92400e; line-height: 1.6;
    }
    #tad-nokey a { color: #1d4ed8; font-weight: 600; text-decoration: underline; }
    @media (max-width: 420px) {
      #tad-panel { width: calc(100vw - 20px); right: 10px; bottom: 88px; }
    }
  `;

const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

const hasKey = true;

// ─── HTML ───────────────────────────────────────────────────────────────────
const html = `
    <button id="tad-fab" title="Asistente IA" aria-label="Abrir asistente">
      <span id="tad-badge"></span>
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </button>
    <div id="tad-panel" class="tad-hidden" role="dialog" aria-label="Asistente IA TAD 12">
      <div id="tad-header">
        <div id="tad-avatar">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
        </div>
        <div id="tad-header-text">
          <div class="tad-name">Asistente TAD 12</div>
          <div class="tad-status"><span class="tad-dot"></span> Mercado laboral · 2010-2025</div>
        </div>
        <button id="tad-close" aria-label="Cerrar">✕</button>
      </div>
      <div id="tad-messages"></div>
      <div id="tad-chips">
        <button class="tad-chip" data-q="¿Cuál es la brecha de género en ocupación?">Brecha de género</button>
        <button class="tad-chip" data-q="¿Qué es la TGP y cómo se interpreta?">¿Qué es la TGP?</button>
        <button class="tad-chip" data-q="¿Cómo afectó el COVID-19 al empleo en 2020?">Pandemia 2020</button>
        <button class="tad-chip" data-q="¿Qué tendencias se observan de 2010 a 2025?">Tendencias</button>
      </div>
      <div id="tad-input-row">
        <textarea id="tad-input" placeholder="Pregunta sobre el análisis..." rows="1"></textarea>
        <button id="tad-send" aria-label="Enviar">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  `;

const wrapper = document.createElement('div');
wrapper.innerHTML = html;
document.body.appendChild(wrapper);

let history = [];
let loading = false;
let open = false;

const panel  = document.getElementById('tad-panel');
const fab    = document.getElementById('tad-fab');
const msgs   = document.getElementById('tad-messages');
const input  = document.getElementById('tad-input');
const sendBtn = document.getElementById('tad-send');
const chips  = document.getElementById('tad-chips');

function togglePanel() {
    open = !open;
    panel.classList.toggle('tad-hidden', !open);
    if (open && history.length === 0) {
        addBot('¡Hola! Soy el asistente de TAD 12 con IA de Grok. Puedo explicarte los indicadores del mercado laboral, los hallazgos del análisis o responder preguntas generales. ¿En qué te ayudo?');
    }
    if (open && input) input.focus();
}

fab.addEventListener('click', togglePanel);
document.getElementById('tad-close').addEventListener('click', togglePanel);

chips.querySelectorAll('.tad-chip').forEach(btn => {
    btn.addEventListener('click', () => {
        chips.style.display = 'none';
        send(btn.getAttribute('data-q'));
    });
});

if (input) {
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 90) + 'px';
    });
}

if (sendBtn) sendBtn.addEventListener('click', () => send());

function addBot(text) {
    const d = document.createElement('div');
    d.className = 'tad-msg bot';
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
}

function addUser(text) {
    const d = document.createElement('div');
    d.className = 'tad-msg user';
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
    const t = document.createElement('div');
    t.id = 'tad-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById('tad-typing');
    if (t) t.remove();
}

async function send(text) {
    if (loading) return;
    const userText = text || (input ? input.value.trim() : '');
    if (!userText) return;

    if (input) { input.value = ''; input.style.height = 'auto'; }
    addUser(userText);
    history.push({ role: 'user', content: userText });

    loading = true;
    if (sendBtn) sendBtn.disabled = true;
    showTyping();

    try {
        const res = await fetch(GROK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: GROK_MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...history
                ]
            })
        });
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content
            || 'No pude obtener una respuesta. Intenta de nuevo.';
        removeTyping();
        addBot(reply);
        history.push({ role: 'assistant', content: reply });
    } catch (err) {
        removeTyping();
        addBot('Error de conexión. Verifica el proxy de Netlify e intenta de nuevo.');
    }

    loading = false;
    if (sendBtn) sendBtn.disabled = false;
}

