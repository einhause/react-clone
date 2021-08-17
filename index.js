import Component from './Component.js';
import { render } from './MyReact.js';

let propCount = 0;
document.getElementById('btn-prop').addEventListener('click', () => {
  propCount++;
  renderComponent();
});

function renderComponent() {
  render(Component, { propCount }, document.getElementById('root'));
}

renderComponent();
