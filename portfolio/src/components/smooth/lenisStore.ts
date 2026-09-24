import type Lenis from 'lenis';

/** Доступ к экземпляру Lenis из других компонентов (например, модалка проекта блокирует скролл). */
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;
