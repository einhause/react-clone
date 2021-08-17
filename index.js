import { render } from './MyReact.js';
import Component from './Component.js';

// Event listener used to increment prop count variable, custom useMemo will also
// update the doubled value of propCount since it is a dependency

let propCount = 0;
document.getElementById('btn-prop').addEventListener('click', () => {
  propCount++;
  renderComponent();
});

// Renders component instances on document
function renderComponent() {
  render(
    Component,
    { propCount, buttonElem: document.getElementById('btn-count') },
    document.getElementById('root')
  );
  render(
    Component,
    { propCount, buttonElem: document.getElementById('btn-count-2') },
    document.getElementById('root-2')
  );
}

renderComponent();
