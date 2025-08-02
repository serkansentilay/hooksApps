// simpleStore.js
let currentValue = 0;
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentValue;
}

function increment() {
  currentValue += 1;
  listeners.forEach(listener => listener());
}

export { subscribe, getSnapshot, increment };
