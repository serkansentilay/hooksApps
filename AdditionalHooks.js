//useReducer

/*
const [state, dispatch] = useReducer(reducer, initialArg, init);
An alternative to useState. Accepts a reducer of type (state, action) => newState, 
and returns the current state paired with a dispatch method. (If you’re familiar 
with Redux, you already know how this works.)
useReducer is usually preferable to useState when you have complex state logic 
that involves multiple sub-values or when the next state depends on the previous 
one. useReducer also lets you optimize performance for components that trigger 
deep updates because you can pass dispatch down instead of callbacks.
Here’s the counter example from the useState section, rewritten to use a reducer:
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
Note
React guarantees that dispatch function identity is stable and won’t change
 on re-renders. This is why it’s safe to omit from the useEffect or useCallback dependency list.

*/

/*
Specifying the initial state
There are two different ways to initialize useReducer state. You may choose either 
one depending on the use case. The simplest way is to pass the initial state as a second argument:
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
Note
React doesn’t use the state = initialState argument convention popularized by Redux.
 The initial value sometimes needs to depend on props and so is specified from the
  Hook call instead. If you feel strongly about this, you can call 
  useReducer(reducer, undefined, reducer) to emulate the Redux behavior, but it’s
   not encouraged.

*/

/*
Lazy initialization
You can also create the initial state lazily. To do this, you can pass an init 
function as the third argument. The initial state will be set to init(initialArg).
It lets you extract the logic for calculating the initial state outside the reducer. 
This is also handy for resetting the state later in response to an action:
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}

*/

/*
Bailing out of a dispatch
If you return the same value from a Reducer Hook as the current state, React 
will bail out without rendering the children or firing effects. (React uses the 
Object.is comparison algorithm.)
Note that React may still need to render that specific component again before 
bailing out. That shouldn’t be a concern because React won’t unnecessarily go 
“deeper” into the tree. If you’re doing expensive calculations while rendering,
 you can optimize them with useMemo.

*/



//useCallback

/*
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
Returns a memoized callback.
Pass an inline callback and an array of dependencies. useCallback will return a memoized 
version of the callback that only changes if one of the dependencies has changed. This is 
useful when passing callbacks to optimized child components that rely on reference equality 
to prevent unnecessary renders (e.g. shouldComponentUpdate).
useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).
Note
The array of dependencies is not passed as arguments to the callback. Conceptually, though, 
that’s what they represent: every value referenced inside the callback should also appear 
in the dependencies array. In the future, a sufficiently advanced compiler could create 
this array automatically.
*/

/*
useCallback hook'u, React Native (ve genel olarak React) uygulamalarında bir 
fonksiyonun gereksiz yere yeniden oluşturulmasını önlemek amacıyla kullanılır.
 Bu, özellikle alt bileşenlere prop olarak fonksiyon geçirirken, yeniden render
  durumlarında performansı artırmak için önemlidir.

useCallback bir memoization aracıdır. Bir fonksiyonu bellekte tutar ve bağımlılıkları
 değişmediği sürece aynı referansı kullanır.

 const memoizedCallback = useCallback(() => {
  // fonksiyon içeriği
}, [dependencies]);
*/

/*
Ne zaman kullanılır?
Bir fonksiyon alt bileşene prop olarak geçiyorsa ve bu alt bileşen React.memo ile sarmalanmışsa.
Aynı fonksiyonun her render’da yeniden oluşturulması performans kaybına neden oluyorsa.
Bir efekt (useEffect) içinde kullanılan fonksiyonun referansının sabit kalması gerekiyorsa.

*/

