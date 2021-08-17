let globalId = 0;
let globalParent;
const componentState = new Map();

/* 
  Mock of useState: returns a state and a setter
  @args:
  initialState: the initial state of a generic state
*/
export function useState(initialState) {
  const id = globalId;
  const parent = globalParent;
  globalId++;

  // Closure used to prevent state clashes from other component instances
  return (() => {
    const { cache } = componentState.get(parent);
    if (cache[id] == null) {
      cache[id] = {
        value:
          typeof initialState === 'function' ? initialState() : initialState,
        // State can be functional or by value
      };
    }

    const setState = (state) => {
      const { props, component } = componentState.get(parent);
      if (typeof state === 'function') {
        cache[id].value = state(cache[id].value);
      } else {
        cache[id].value = state;
      }

      render(component, props, parent);
    };

    return [cache[id].value, setState];
  })();
}

/* 
  useEffect mock: calls a callback function dependent on dependencies array
  @args
  callback: callback function
  dependencies: an array of state
*/
export function useEffect(callback, dependencies) {
  const id = globalId;
  const parent = globalParent;
  globalId++;

  // Closure used to prevent state clashes from other component instances
  (() => {
    const { cache } = componentState.get(parent);

    // If initial call, initialize dependencies
    if (cache[id] == null) {
      cache[id] = { dependencies: undefined };
    }

    // If dependencies have changed, call cleanup function, set new cleanup
    // function to callback function that was passed, and update dependencies
    // in case it has changed
    const dependenciesChanged =
      dependencies == null ||
      dependencies.some((dependency, i) => {
        return (
          cache[id].dependencies == null ||
          cache[id].dependencies[i] !== dependency
        );
      });

    if (dependenciesChanged) {
      if (cache[id].cleanup != null) cache[id].cleanup();
      cache[id].cleanup = callback();
      cache[id].dependencies = dependencies;
    }
  })();
}

/* 
  useMemo mocking hook: returns a value dependent on the dependencies
  @args:
  callback: callback function
  dependencies: dependency list of state values
*/
export function useMemo(callback, dependencies) {
  const id = globalId;
  const parent = globalParent;
  globalId++;

  // Closure used to prevent state clashes from other component instances
  return (() => {
    const { cache } = componentState.get(parent);
    if (cache[id] == null) {
      cache[id] = { dependencies: undefined };
    }

    const dependenciesChanged =
      dependencies == null ||
      dependencies.some((dependency, i) => {
        return (
          cache[id].dependencies == null ||
          cache[id].dependencies[i] !== dependency
        );
      });

    if (dependenciesChanged) {
      cache[id].value = callback();
      cache[id].dependencies = dependencies;
    }

    return cache[id].value;
  })();
}

/* 
  Updates component state, global variables that are utilized by hooks,
  and renders content on the document.
  @args:
  component: Functional custom react component
  props: Props passed to component
  parent: Parent of the component, in this case, the document
*/
export function render(component, props, parent) {
  const state = componentState.get(parent) || { cache: [] };
  componentState.set(parent, { ...state, component, props });
  globalParent = parent;
  const output = component(props);
  globalId = 0;
  parent.textContent = output;
}
