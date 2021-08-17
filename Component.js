import { useState } from './MyReact.js';

export default function Component({ propCount }) {
  const [count, setCount] = useState(10);
  const propCountDoubled = 0;

  return `
        State: ${count}
        Prop: ${propCount}
        Prop Double: ${propCountDoubled}
    `;
}
