// Sesión de demostración (decisión 2.24, H33). Funciona como funcionará la real: por defecto todo el mundo es
// visitante; "Entrar" o terminar el Registro inician la sesión de la usuaria del demo (Camila Vargas) y el
// navegador la recuerda; "Cerrar sesión" vuelve a visitante. En producción la sesión la da el backend.
//
// <html> sale del servidor con data-sesion="no"; layouts/Base.astro la pasa a "si" antes de pintar (sin parpadeo)
// y lleva a /entrar las páginas que piden sesión. Las clases globales .solo-sesion y .solo-visitante
// (styles/base.css) muestran una u otra versión.
//
// Todo acceso a localStorage va en try/catch: en modo privado o con el almacenamiento bloqueado puede fallar,
// y eso cuenta como "sin sesión".

export const CLAVE_SESION = 'fe-sesion-demo';

export const haySesion = (): boolean => {
  try {
    return localStorage.getItem(CLAVE_SESION) === '1';
  } catch {
    return false;
  }
};

// Devuelve false si el navegador no deja guardar la sesión (modo privado estricto)
export const iniciarSesion = (): boolean => {
  try {
    localStorage.setItem(CLAVE_SESION, '1');
  } catch {
    return false;
  }
  document.documentElement.dataset.sesion = 'si';
  return haySesion();
};

export const cerrarSesion = () => {
  try {
    localStorage.removeItem(CLAVE_SESION);
  } catch {
    // Sin almacenamiento no había sesión guardada
  }
  document.documentElement.dataset.sesion = 'no';
};

// Destino seguro para ?volver=: solo rutas internas ("/algo", nunca "//otro-sitio" ni "/\otro-sitio").
// Entrar y Registro no son destino de vuelta (darían una vuelta en círculo).
export const rutaVolver = (param: string | null | undefined, defecto = '/inicio'): string => {
  if (!param || !param.startsWith('/') || param.startsWith('//') || param.includes('\\')) return defecto;
  // Sin caracteres de control (un salto de línea o un tab pueden cambiar cómo se lee la URL)
  if (/[\u0000-\u001F\u007F]/.test(param)) return defecto;
  if (/^\/(entrar|registro)(\/|\?|#|$)/.test(param)) return defecto;
  return param;
};

// "/entrar?volver=%2Fagenda%3Fciudad%3Dcali"
export const conVolver = (destino: string, volver: string) => `${destino}?volver=${encodeURIComponent(volver)}`;

// Ruta actual completa (con filtros y ancla), para volver al mismo punto
export const rutaActual = () => `${location.pathname}${location.search}${location.hash}`;
