// ============================================
// TAD 12 - ASISTENTE IA v2.0
// Endpoint migrado a Vercel (/api/grok)
// ============================================
(function () {
  const html = `
    <button id="tad-fab" title="Asistente TAD 12" aria-label="Abrir asistente">🤖</button>
    <div id="tad-panel" class="tad-hidden" role="dialog" aria-label="Asistente TAD 12">
      <div class="tad-header">
        <div class="tad-header-info">
          <div class="tad-avatar">🤖</div>
          <div>
            <h3>Asistente TAD 12</h3>
            <p>Powered by Groq AI</p>
          </div>
        </div>
        <button id="tad-close" class="tad-close" aria-label="Cerrar">✕</button>
      </div>
      <div id="tad-messages" role="log" aria-live="polite"></div>
      <div id="tad-chips" class="tad-chips">
        <button class="tad-chip" data-q="¿Cuál es la brecha de género en ocupación?">Brecha de género</button>
        <button class="tad-chip" data-q="¿Qué pasó con el empleo en 2020?">Impacto COVID-19</button>
        <button class="tad-chip" data-q="¿Cuál es la tendencia de la tasa de ocupación?">Tendencia TO</button>
        <button class="tad-chip" data-q="Explícame la Tasa Global de Participación">¿Qué es la TGP?</button>
      </div>
      <div class="tad-input-area">
        <textarea id="tad-input" placeholder="Pregunta sobre los datos laborales..." rows="1" aria-label="Mensaje"></textarea>
        <button id="tad-send" aria-label="Enviar">➤</button>
      </div>
    </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const root = document.getElementById('tad-assistant-root') || document.body;
  root.appendChild(wrapper);

  let history = [];
  let loading = false;
  let open = false;

  const panel   = document.getElementById('tad-panel');
  const fab     = document.getElementById('tad-fab');
  const msgs    = document.getElementById('tad-messages');
  const input   = document.getElementById('tad-input');
  const sendBtn = document.getElementById('tad-send');
  const chips   = document.getElementById('tad-chips');

  const SYSTEM_PROMPT = `Eres el asistente de TAD 12, una plataforma de análisis del mercado laboral colombiano.
Tienes acceso a datos del DANE de Colombia para el período 2010-2025.
Los indicadores principales son:
- TGP (Tasa Global de Participación): ~62% nacional
- TO (Tasa de Ocupación): ~59% nacional, con brecha de ~25pp entre géneros
- TD (Tasa de Desocupación): ~5.6% en 2025, llegó a 15.9% en 2020 por COVID-19
- TS (Tasa de Subocupación): ~7.2% en 2025
La ocupación femenina promedio es 45.4% vs 71.2% masculina (brecha de 25.8pp).
Responde siempre en español, de forma clara, concisa y con datos específicos cuando sea posible.`;

  function togglePanel() {
    open = !open;
    panel.classList.toggle('tad-hidden', !open);
    if (open && history.length === 0) {
      addBot('¡Hola! Soy el asistente de TAD 12. Puedo explicarte los indicadores del mercado laboral colombiano, los hallazgos del análisis o responder tus preguntas sobre los datos. ¿En qué te ayudo?');
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
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
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
    t.className = 'tad-msg bot';
    t.innerHTML = '<div class="tad-typing"><div class="tad-dot"></div><div class="tad-dot"></div><div class="tad-dot"></div></div>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('tad-typing');
    if (t) t.remove();
  }

  async function send(text) {
    const msg = text || (input ? input.value.trim() : '');
    if (!msg || loading) return;
    if (input) { input.value = ''; input.style.height = 'auto'; }

    addUser(msg);
    history.push({ role: 'user', content: msg });
    loading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      // Endpoint Vercel: /api/grok
      const response = await fetch('/api/grok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.slice(-8)
          ],
          max_tokens: 512,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      hideTyping();

      if (data.choices && data.choices[0]) {
        const reply = data.choices[0].message.content;
        addBot(reply);
        history.push({ role: 'assistant', content: reply });
      } else if (data.error) {
        addBot('Lo siento, ocurrió un error: ' + (data.error.message || 'Error desconocido'));
      } else {
        addBot('Lo siento, no pude obtener una respuesta. Por favor intenta de nuevo.');
      }
    } catch (err) {
      hideTyping();
      addBot('Error de conexión. Verifica que el servidor esté activo e intenta de nuevo.');
      console.error('TAD Asistente error:', err);
    } finally {
      loading = false;
      sendBtn.disabled = false;
      if (input) input.focus();
    }
  }
})();
