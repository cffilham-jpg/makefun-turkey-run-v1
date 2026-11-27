export function createInput(canvas) {
  const state = {jump: false, duck: false, sprint: false, jumpPressed: false, start: false, pause: false, restart: false};
  const held = new Set();
  const keys = {Space:'jump',ArrowUp:'jump',KeyW:'jump',ArrowDown:'duck',KeyS:'duck',ArrowRight:'sprint',KeyD:'sprint'};
  const update = () => { for (const name of ['jump','duck','sprint']) state[name] = [...held].some(key => key.endsWith(':'+name)); };
  window.addEventListener('keydown', event => {
    if (keys[event.code] || ['Enter','KeyP','KeyR'].includes(event.code)) event.preventDefault();
    if (event.repeat) return;
    const name = keys[event.code];
    if (name) { held.add(event.code+':'+name); if (name === 'jump') state.jumpPressed = true; update(); }
    if (event.code === 'Enter') state.start = true;
    if (event.code === 'KeyP') state.pause = true;
    if (event.code === 'KeyR') state.restart = true;
  });
  window.addEventListener('keyup', event => { if (keys[event.code]) held.delete(event.code+':'+keys[event.code]); update(); });
  window.addEventListener('blur', () => { held.clear(); update(); state.pause = true; });
  canvas.addEventListener('pointerdown', event => { event.preventDefault(); held.add('canvas:jump'); state.jumpPressed = true; state.start = true; update(); canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener('pointerup', () => { held.delete('canvas:jump'); update(); });
  canvas.addEventListener('pointercancel', () => { held.clear(); update(); });
  document.querySelectorAll('[data-control]').forEach(button => {
    const name = button.dataset.control;
    button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); held.add('button:'+name); button.classList.add('held'); if (name === 'jump') state.jumpPressed = true; update(); });
    for (const eventName of ['pointerup','pointercancel','lostpointercapture']) button.addEventListener(eventName, () => { held.delete('button:'+name); button.classList.remove('held'); update(); });
  });
  document.querySelector('#action').addEventListener('click', () => { state.start = true; });
  document.querySelector('#pause').addEventListener('click', () => { state.pause = true; });
  return {state, consume() { state.jumpPressed = state.start = state.pause = state.restart = false; }};
}
