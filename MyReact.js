let globalId = 0;
let globalParent;
const componentState = new Map();

export function useState(initialState) {
  const id = globalId;
  const { cache, props, component } = componentState.get(globalParent);
  if (cache[id] == null) {
    cache[id] = {
      value: typeof initialState === 'function' ? initialState() : initialState,
    };
  }

  const setState = (state) => {
    if (typeof state === 'function') {
      cache[id].value = state(cache[id].value);
    } else {
      cache[id].value = state;
    }
    render(component, props, globalParent);
  };

  const state = cache[id].value;
  globalId++;

  return [state, setState];
}

export function render(component, props, parent) {
  const state = componentState.get(parent) || { cache: [] };
  componentState.set(parent, { ...state, component, props });
  globalParent = parent;
  const output = component(props);
  globalId = 0;
  parent.textContent = output;
}
