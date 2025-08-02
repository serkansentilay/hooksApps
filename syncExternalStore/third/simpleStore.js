let count = 0;
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return count;
}

function increment() {
  count += 1;
  listeners.forEach(listener => listener());
}

export { subscribe, getSnapshot, increment };
