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
 * Inicialização da Tela de Abertura Estática (3 segundos).
 * A intro é exibida apenas na PRIMEIRA visita (navegador).
 * Em reacessos, o cartão aparece diretamente.
 */
const INTRO_STORAGE_KEY = 'andre-oriental-intro-shown-v1';

function initPreloader() {
  const loaderScreen = document.getElementById('loader-screen');
  if (!loaderScreen) return;

  let introAlreadyShown = false;
  try {
    introAlreadyShown = localStorage.getItem(INTRO_STORAGE_KEY) === '1';
  } catch (err) {
    // Armazenamento indisponível: segue como primeira visita
  }

  // Já viu a intro: remove a tela de abertura e revela o cartão direto
  if (introAlreadyShown) {
    loaderScreen.remove();
    document.body.classList.add('content-ready');
    return;
  }

  // Primeira visita: registra e reproduz a intro completa
  try {
    localStorage.setItem(INTRO_STORAGE_KEY, '1');
  } catch (err) {
    // Armazenamento indisponível: ignora
  }

  // Garante bloqueio da rolagem do body durante a intro
  document.body.style.overflow = 'hidden';

  // Após 3 segundos exatos, revela o conteúdo e faz o fade-out da tela de abertura
  setTimeout(() => {
    document.body.classList.add('content-ready');
    loaderScreen.classList.add('fade-out');
    document.body.style.overflow = '';
  }, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPreloader);
} else {
  initPreloader();
}

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
    modal.classList.remove('closing');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Fecha um popup/modal específico pelo ID.
 * Reproduz a animação reversa de fechamento e remove a classe 'active'.
 * @param {string} modalId - O identificador do modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(`modal-${modalId}`);
  if (!modal) return;
  if (modal.classList.contains('closing')) return;

  modal.classList.add('closing');

  // Aguarda a animação reversa terminar para então ocultar de fato
  setTimeout(() => {
    modal.classList.remove('closing');
    modal.classList.remove('active');
    // Só restaura overflow do body se não houver outros modais ativos
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    if (activeModals.length === 0) {
      document.body.style.overflow = '';
    }
  }, 400);
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
