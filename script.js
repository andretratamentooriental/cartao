/**
 * ==========================================================================
 * LOGIC - ANDRÉ TRATAMENTO ORIENTAL (Virtual Premium Card)
 * ==========================================================================
 */

// Configurações
const CONFIG = {
  phone: '5515981031798'
};

/**
 * Inicialização da Tela de Carregamento (Preloader de 5 segundos)
 * É executada SEMPRE que a página é carregada ou atualizada.
 */
document.addEventListener('DOMContentLoaded', () => {
  const loaderScreen = document.getElementById('loader-screen');
  const loaderBarFill = document.getElementById('loader-bar-fill');

  if (loaderScreen && loaderBarFill) {
    // Bloqueia rolagem do body durante a intro
    document.body.style.overflow = 'hidden';

    const durationMs = 5000; // 5 segundos exatos
    const intervalMs = 40;
    let elapsedMs = 0;

    const timer = setInterval(() => {
      elapsedMs += intervalMs;
      const progressPercent = Math.min((elapsedMs / durationMs) * 100, 100);
      loaderBarFill.style.width = `${progressPercent}%`;

      if (elapsedMs >= durationMs) {
        clearInterval(timer);
        // Oculta a tela com animação de fade-out
        loaderScreen.classList.add('fade-out');
        // Restaura rolagem normal da página
        document.body.style.overflow = '';
      }
    }, intervalMs);
  }
});

// Mapeamento de mensagens do WhatsApp por tratamento
const TREATMENT_MESSAGES = {
  acupuntura: 'Olá! Gostaria de agendar uma sessão de Acupuntura.',
  ventosaterapia: 'Olá! Gostaria de agendar uma sessão de Ventosaterapia.',
  auriculoterapia: 'Olá! Gostaria de agendar uma sessão de Auriculoterapia.',
  massoterapia: 'Olá! Gostaria de agendar uma sessão de Massoterapia.',
  moxabustao: 'Olá! Gostaria de agendar uma sessão de Moxabustão.',
  tuina: 'Olá! Gostaria de agendar uma sessão de Tuiná.'
};

/**
 * Abre um popup/modal específico pelo ID.
 * Adiciona a classe 'active' e previne rolagem do body.
 * @param {string} modalId - O identificador do modal (about, acupuntura, ventosaterapia, etc.)
 */
function openModal(modalId) {
  const modal = document.getElementById(`modal-${modalId}`);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Fecha um popup/modal específico pelo ID.
 * Remove a classe 'active' e restaura a rolagem do body.
 * @param {string} modalId - O identificador do modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(`modal-${modalId}`);
  if (modal) {
    modal.classList.remove('active');
    // Só restaura overflow do body se não houver outros modais ativos
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    if (activeModals.length === 0) {
      document.body.style.overflow = '';
    }
  }
}

/**
 * Fecha o modal se o clique do usuário for feito fora do conteúdo principal (no overlay).
 * @param {Event} event - Evento de clique
 * @param {string} modalId - O identificador do modal
 */
function closeModalOnOverlay(event, modalId) {
  if (event.target === event.currentTarget) {
    closeModal(modalId);
  }
}

/**
 * Abre o WhatsApp com uma mensagem personalizada.
 * @param {string} text - A mensagem de texto a ser enviada
 */
function openWhatsApp(text) {
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${CONFIG.phone}?text=${encodedText}`;
  window.open(url, '_blank');
}

/**
 * Inicia o chat no WhatsApp com uma mensagem geral para agendamento.
 */
function startWhatsAppGeneralChat() {
  const message = 'Olá, gostaria de agendar uma consulta de tratamento oriental.';
  openWhatsApp(message);
}

/**
 * Inicia o chat no WhatsApp com uma mensagem específica para um tratamento.
 * @param {string} treatmentKey - A chave do tratamento (acupuntura, ventosaterapia, etc.)
 */
function startWhatsAppTreatment(treatmentKey) {
  const message = TREATMENT_MESSAGES[treatmentKey] || 'Olá, gostaria de agendar um atendimento.';
  openWhatsApp(message);
}

// Fechar modais ao pressionar a tecla ESC
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    activeModals.forEach((modal) => {
      const modalId = modal.id.replace('modal-', '');
      closeModal(modalId);
    });
  }
});
