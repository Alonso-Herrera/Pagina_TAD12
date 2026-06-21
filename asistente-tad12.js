(function() {
  let open = false;
  const root = document.getElementById('tad-assistant-root');
  if (!root) return;

  root.innerHTML = `
    <button id="tad-fab" title="Abrir asistente">🤖</button>
    <div id="tad-panel" class="tad-hidden">
      <div class="tad-header">
        <h3>Asistente TAD 12</h3>
        <button id="tad-close">✕</button>
      </div>
      <div id="tad-messages">
        <div class="tad-msg bot">¡Hola! Soy tu asistente de datos laborales. ¿En qué puedo ayudarte hoy?</div>
      </div>
      <div id="tad-chips" class="tad-chips">
        <button class="tad-chip">Brecha de género</button>
        <button class="tad-chip">Impacto COVID-19</button>
        <button class="tad-chip">¿Qué es la TGP?</button>
      </div>
      <div class="tad-input-area">
        <textarea id="tad-input" placeholder="Escribe tu duda..." rows="1"></textarea>
        <button id="tad-send">➤</button>
      </div>
    </div>
  `;

  const fab     = document.getElementById('tad-fab');
  const panel   = document.getElementById('tad-panel');
  const close   = document.getElementById('tad-close');
  const messages= document.getElementById('tad-messages');
  const input   = document.getElementById('tad-input');
  const sendBtn = document.getElementById('tad-send');

  const style = document.createElement('style');
  style.textContent = `
    .tad-header { background: #00A878; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0; }
    .tad-header h3 { margin: 0; font-size: 0.9rem; font-family: 'Inter', sans-serif; }
    #tad-close { background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; }
    #tad-messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; background: #fdfdfd; }
    .tad-msg { padding: 0.7rem 0.9rem; border-radius: 8px; font-size: 0.85rem; line-height: 1.4; max-width: 85%; font-family: 'Inter', sans-serif; }
    .tad-msg.bot { background: #E9ECEF; color: #2D3748; align-self: flex-start; }
    .tad-msg.user { background: #00A878; color: white; align-self: flex-end; }
    .tad-chips { padding: 0.5rem 1rem; display: flex; gap: 0.4rem; flex-wrap: wrap; background: #fdfdfd; }
    .tad-chip { padding: 0.35rem 0.75rem; border: 1px solid #00A878; background: white; color: #00A878; border-radius: 20px; font-size: 0.7rem; cursor: pointer; font-weight: 600; }
    .tad-chip:hover { background: #00A878; color: white; }
    .tad-input-area { padding: 1rem; border-top: 1px solid #E9ECEF; display: flex; gap: 0.5rem; background: white; border-radius: 0 0 12px 12px; }
    #tad-input { flex: 1; border: 1px solid #CED4DA; border-radius: 4px; padding: 0.5rem; font-size: 0.85rem; font-family: inherit; outline: none; resize: none; }
    #tad-send { background: #00A878; color: white; border: none; border-radius: 4px; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  `;
  document.head.appendChild(style);

  function toggle() {
    open = !open;
    panel.classList.toggle('tad-hidden', !open);
    if (open) input.focus();
  }

  fab.onclick = toggle;
  close.onclick = toggle;

  document.querySelectorAll('.tad-chip').forEach(chip => {
    chip.onclick = () => {
      input.value = chip.innerText;
      sendMessage();
    };
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    
    const loadingMsg = addMessage('Pensando...', 'bot');

    try {
      const response = await fetch('/api/grok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      loadingMsg.innerText = data.reply || 'No pude obtener una respuesta.';
    } catch (e) {
      loadingMsg.innerText = 'Error: ' + e.message;
    }
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.className = `tad-msg ${type}`;
    div.innerText = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  sendBtn.onclick = sendMessage;
  input.onkeypress = (e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } };

})();
