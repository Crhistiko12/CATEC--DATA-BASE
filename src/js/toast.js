// src/js/toast.js

/**
 * Muestra una notificación toast estilizada.
 * @param {string} message - El mensaje a mostrar.
 * @param {'success' | 'error' | 'info'} type - El tipo de toast, para el estilo.
 * @param {number} duration - Duración en milisegundos antes de que desaparezca.
 */
export function showToast(message, type = 'info', duration = 3000) {
  let toastContainer = document.getElementById('toast-container');

  // Si el contenedor no existe, lo crea.
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-5 right-5 z-50 space-y-2';
    document.body.appendChild(toastContainer);
  }

  const toastId = `toast-${Date.now()}`;
  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = 'flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg transition-all transform-gpu animate-fade-in-right';

  // Colores y iconos basados en el tipo
  const styles = {
    success: {
      icon: '<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
      text: 'text-green-800',
    },
    error: {
      icon: '<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>',
      text: 'text-red-800',
    },
    info: {
      icon: '<svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>',
      text: 'text-blue-800',
    },
  };

  toast.innerHTML = `
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100">
      ${styles[type].icon}
    </div>
    <div class="ml-3 text-sm font-normal ${styles[type].text}">${message}</div>
    <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8" data-dismiss-target="#${toastId}" aria-label="Close">
      <span class="sr-only">Close</span>
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    </button>
  `;

  toastContainer.appendChild(toast);

  const closeButton = toast.querySelector(`[data-dismiss-target="#${toastId}"]`);
  const removeToast = () => {
    toast.classList.add('animate-fade-out-right');
    toast.addEventListener('animationend', () => toast.remove());
  };

  closeButton?.addEventListener('click', removeToast);

  setTimeout(removeToast, duration);
}
