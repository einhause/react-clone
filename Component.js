import { useState, useEffect, useMemo } from './MyReact.js';

// Instance of a React component with mock React hooks built with Vanilla JS
export default function Component(props) {
  const { propCount, buttonElem } = props;
  const [count, setCount] = useState(0);
  const propCountDoubled = useMemo(() => {
    return propCount * 2;
  }, [propCount]);

  useEffect(() => {
    const handler = () => setCount((currentCount) => currentCount + 1);
    buttonElem.addEventListener('click', handler);

    return () => buttonElem.removeEventListener('click', handler);
  }, [buttonElem]);

  return `
    State: ${count}
    Prop: ${propCount}
    Prop Doubled: ${propCountDoubled}
  `;
}
