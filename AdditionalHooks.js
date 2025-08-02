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

//useMemo

/*
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
Returns a memoized value.
Pass a “create” function and an array of dependencies. useMemo will only recompute the
 memoized value when one of the dependencies has changed. This optimization helps to avoid
  expensive calculations on every render.
Remember that the function passed to useMemo runs during rendering. Don’t do anything there
 that you wouldn’t normally do while rendering. For example, side effects belong in useEffect, 
 not useMemo.
If no array is provided, a new value will be computed on every render.
You may rely on useMemo as a performance optimization, not as a semantic guarantee. In the 
future, React may choose to “forget” some previously memoized values and recalculate them on 
next render, e.g. to free memory for offscreen components. Write your code so that it still 
works without useMemo — and then add it to optimize performance.
Note
The array of dependencies is not passed as arguments to the function. Conceptually, though, 
that’s what they represent: every value referenced inside the function should also appear 
in the dependencies array. In the future, a sufficiently advanced compiler could create
 this array automatically.


 useMemo, hesaplama sonucu bir değeri bellekte tutmak için kullanılır.
Eğer bir değer (örneğin dizi sıralama, filtreleme, pahalı bir işlem) her render’da
 tekrar hesaplanmasın istiyorsan, useMemo ile önbelleğe alırsın.

*/



//useref

/*
React'te bir kutudur. İçine bir şey koyarsın (.current içine) ve o değer 
render’lar arasında korunur.
const myRef = useRef(initialValue);
Burada myRef.current, ilk başta initialValue’ya eşittir ve sonra sen ne 
yazarsan o olur. Ama en önemlisi:
Bu .current değeri değişse bile bileşen re-render OLMAZ.

useRef returns a mutable ref object whose .current property is initialized
 to the passed argument (initialValue). The returned object will persist 
 for the full lifetime of the component.
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
Essentially, useRef is like a “box” that can hold a mutable value in its .current property.
You might be familiar with refs primarily as a way to access the DOM. If you 
pass a ref object to React with <div ref={myRef} />, React will set its .current
 property to the corresponding DOM node whenever that node changes.
However, useRef() is useful for more than the ref attribute. It’s handy for keeping 
any mutable value around similar to how you’d use instance fields in classes.
This works because useRef() creates a plain JavaScript object. The only difference 
between useRef() and creating a {current: ...} object yourself is that useRef will 
give you the same ref object on every render.
Keep in mind that useRef doesn’t notify you when its content changes. Mutating 
the .current property doesn’t cause a re-render. If you want to run some code
 when React attaches or detaches a ref to a DOM node, you may want to use a callback ref instead.

 Değişken gibi davranan ama render tetiklemeyen bir şey saklamak
const renderCount = useRef(0);
renderCount.current += 1;

console.log(`Bu bileşen ${renderCount.current} defa render oldu`);
Burada:
renderCount’ı artırıyoruz ama bu değişiklik yeniden render yapmıyor
Yani useRef, bir nevi “state gibi ama re-render yapmayan” bir şey.

useRef().current'ı doğrudan değiştirebilirsin, ama React bu değişikliği farketmez
Re-render tetiklemek için useState kullanman gerekir
useRef objesi her render'da aynı kalır, yeniden oluşmaz


Normalde useState kullansaydık:
const [clickCount, setClickCount] = useState(0);
Her buton tıklamasında yeniden render olurdu. Ama burada, clickCountRef.current 
değişse bile ekran yenilenmiyor.
Bu sayede çok hassas, performanslı işlemler yapılabilir — örneğin:
Zamanlayıcılar
Scroll pozisyonları
Bir bileşene "kaç kez tıklandı" bilgisi
Animasyon içi frame state’leri

*/

//useImperativeHandle

/*
useImperativeHandle(ref, createHandle, [deps])
useImperativeHandle customizes the instance value that is exposed to parent
 components when using ref. As always, imperative code using refs should be 
 avoided in most cases. useImperativeHandle should be used with forwardRef:
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
In this example, a parent component that renders <FancyInput ref={inputRef} /> 
would be able to call inputRef.current.focus().

*/

/*
React normalde "declarative" çalışır:
Yani şunu dersin:
"Şu an input focus'ta olsun" → React bunu duruma göre ayarlar
Ama bazen demek istersin ki:
“ŞİMDİ! O input’a odaklan!”
Bu artık imperative bir yaklaşımdır:
Sen ne zaman ne olacağına manuel karar veriyorsun.
useImperativeHandle, bir bileşenin dışarıdan ref ile erişildiğinde, o ref’in hangi
 "özellikleri" taşıyacağını belirlemeni sağlar.
Yani normalde ref ile bir DOM’a erişirsin (inputRef.current.focus())
Ama useImperativeHandle ile sen ref.current’e istediğin özel methodları ekleyebilirsin.

*/

/*
Basit örnek
🔨 Custom Input bileşeni
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    }
  }));

  return <input ref={inputRef} type="text" />;
});
🔨 Ebeveyn bileşen
export default function App() {
  const myInputRef = useRef();

  return (
    <div>
      <MyInput ref={myInputRef} />
      <button onClick={() => myInputRef.current.focus()}>Fokus</button>
      <button onClick={() => myInputRef.current.clear()}>Temizle</button>
    </div>
  );
}
📌 Ne Oldu Bu Kodda?
MyInput, dışarıdan ref alıyor
Ama o ref’in current'ine biz istediğimiz metotları verdik:
focus()
clear()
Yani dışarıdaki komponent myInputRef.current.focus() gibi çalışabiliyor
Halbuki direkt DOM değil bu — bizim sarmaladığımız özel bir API!
🔍 Ne Zaman Kullanılır?
Kullan gerekiyorsa, ama dikkatli ol:
Kullanım Durumu	Açıklama
🎯 Custom bileşende DOM’a odaklanmak	ref.current.focus() gibi özel API
🧩 Modal, Input gibi bileşeni dışarıdan kontrol etme	"Aç, kapat, temizle" gibi
🚫 State ile yapması çok karmaşık şeyler varsa	Örneğin zamanlama, focus, blur
⚠️ Neden "önermiyoruz" genelde?
Çünkü React’in en güçlü yanı her şeyi declarative olarak yapabilmen.
Imperative kod, kontrolü senin eline alır ama karmaşıklığı da artırır.
Yani:

<input autoFocus /> // declarative (tercih edilir)
yerine:
useEffect(() => inputRef.current.focus(), []);
gibi imperative yazmak, daha çok dikkat ister.
✅ Özet
Konsept	Açıklama
useImperativeHandle	ref.current'e özel fonksiyonlar verir
forwardRef	Bileşenin dışarıdan ref alabilmesini sağlar
Ne zaman kullanılır?	Dış bileşenin iç bileşeni manuel kontrol etmesi gerekiyorsa
Neden dikkatli olmalı?	React’in deklaratif yapısını zayıflatır
İstersen useImperativeHandle ile bir Modal kontrol örneği yapabiliriz:
👉 dışarıdan modalRef.current.open() dediğinde modal açılsın.


neden useImperativeHandle?
Çünkü bazen:
🧱 State’i yukarı taşımak istemezsin
Modal'ın içeriği çok karmaşık olabilir
visible kontrolünü bileşenin kendi içinde yönetmek daha temiz olabilir
🧩 Modalı global gibi kullanmak istersin
Örneğin "her yerden açılabilen" bir hata mesajı, bottom sheet, toast...
⚙️ Bileşenin içini dışarıya açık etmek istersin
modalRef.current.open(message) gibi özel kullanım API'si oluşturmak istersin

*/


/*
Ref Nedir?
React’te bir DOM elemanına veya React bileşenine doğrudan erişmek için kullanılır.
Örneğin, bir <input> elementine ref verip, o inputu programatik olarak focuslamak istersin.
React Native’de de TextInput gibi native bileşenlere erişmek için kullanılır.
const inputRef = useRef();
<input ref={inputRef} />
inputRef.current.focus();

 useRef Hook Nedir?
React fonksiyon bileşenlerinde ref objesi oluşturmak için kullanılır.
.current adında mutable (değiştirilebilir) bir property’si olan bir obje döner.
Bu obje, component yeniden render olsa bile aynı referansla kalır.
Sadece DOM’a erişmek için değil, herhangi bir mutable değeri tutmak için de kullanılabilir.

 Normal Ref Kullanımı
Bir DOM veya native elemente doğrudan erişip onun methodlarını çağırmak için kullanılır.
Örnek: inputRef.current.focus() ile input’u focuslamak.

Bir bileşenin ref’i aracılığıyla dışarıya neyin açılacağını kontrol etmeye yarar.
Yani, parent bileşen ref.current ile doğrudan alt bileşenin iç detaylarına değil,
 sadece belli methodlara veya değerlere erişir.
forwardRef ile birlikte kullanılır.
Bileşeni kapsüller (encapsulate) ve sadece istediğin API’yi dışa açar.

ref: Elementlere erişmek için.
useRef: Ref objesi oluşturmak ve mutable veri tutmak için.
useImperativeHandle: Ref’in dışa açtığı arayüzü özelleştirmek, kapsüllü API oluşturmak için.

*/



//useLayoutEffect

/*
The signature is identical to useEffect, but it fires synchronously after all 
DOM mutations. Use this to read layout from the DOM and synchronously re-render. 
Updates scheduled inside useLayoutEffect will be flushed synchronously, before the 
browser has a chance to paint.
Prefer the standard useEffect when possible to avoid blocking visual updates.
Tip
If you’re migrating code from a class component, note useLayoutEffect fires in the 
same phase as componentDidMount and componentDidUpdate. However, we recommend starting 
with useEffect first and only trying useLayoutEffect if that causes a problem.
If you use server rendering, keep in mind that neither useLayoutEffect nor useEffect 
can run until the JavaScript is downloaded. This is why React warns when a server-rendered 
component contains useLayoutEffect. To fix this, either move that logic to useEffect 
(if it isn’t necessary for the first render), or delay showing that component until 
after the client renders (if the HTML looks broken until useLayoutEffect runs).
To exclude a component that needs layout effects from the server-rendered HTML, render
 it conditionally with showChild && <Child /> and defer showing it with 
 useEffect(() => { setShowChild(true); }, []). This way, the UI doesn’t appear broken
 before hydration.

*/



/*
Signature olarak useEffect ile aynı (yani () => { ... }, [deps] şeklinde).
Ama çalışma zamanı ve amacı farklıdır.
useLayoutEffect Nasıl Çalışır?
React, DOM değişikliklerini (DOM mutations) yaptıktan sonra, ama tarayıcı henüz
 ekranı güncellemeden (paint) hemen önce useLayoutEffect içindeki fonksiyonu senkron 
 (eşzamanlı) olarak çalıştırır.
Bu demek oluyor ki:
DOM tamamen güncellendi (örneğin, yeni elementler render edildi, stil değişti),
Ama henüz kullanıcıya görünür hale gelmedi (henüz paint yapılmadı),
Bu aşamada useLayoutEffect devreye girer.
Ne İşe Yarar?
DOM’dan layout bilgisi okumak (örneğin, bir elementin yüksekliği, genişliği, pozisyonu
 vb. değerleri getBoundingClientRect gibi fonksiyonlarla almak),
Ve bu değerlere göre senkron bir şekilde state güncelleyip, yeniden render tetiklemek istiyorsan,
Bunu useEffect değil useLayoutEffect ile yapmalısın.

*/

/*
| Özellik                 | useEffect                                               | useLayoutEffect                                        |
| ----------------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| Çalışma zamanı          | DOM güncelleme ve paint tamamlandıktan sonra (asenkron) | DOM güncellemeden hemen sonra, paint öncesi (senkron)  |
| Kullanım amacı          | API çağrıları, event listener, timer vb. yan etkiler    | DOM ölçümü ve senkron state güncellemeleri             |
| Render bloklama durumu  | Hayır, paint sonrası çalışır, UI bloke olmaz            | Evet, paint öncesi çalışır, UI bloklanabilir           |
| Performans etkisi       | Daha iyi performans, çünkü paint sonrası                | UI gecikmesine sebep olabilir, dikkatli kullan         |
| React lifecycle (class) | componentDidMount ve componentDidUpdate sonrası         | componentDidMount ve componentDidUpdate ile aynı fazda |

*/

/*
Neden useLayoutEffect Kullanmalı?
Diyelim ki bir komponent içinde bir div’in yüksekliğini ölçüyorsun ve bu 
yüksekliğe göre başka elementlerin stilini ayarlıyorsun.
Eğer bunu useEffect içinde yaparsan:
React önce DOM’u günceller ve paint yapar,
Sonra useEffect çalışır, sen state’i güncellersin,
React yeniden render eder,
Bu da gözle görülebilir flicker (kısa bir titreşim) yaratabilir.
Ama useLayoutEffect kullanırsan:
Ölçüm ve state güncelleme paint yapılmadan önce senkron çalışır,
React bütün değişiklikleri tek seferde yapar,
Böylece flicker olmaz, UI akıcı olur.

*/

/*
import React, { useState, useLayoutEffect, useRef } from 'react';

function Box() {
  const [height, setHeight] = useState(0);
  const ref = useRef();

  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    setHeight(rect.height);
  }, []);

  return (
    <>
      <div ref={ref} style={{ height: 100, backgroundColor: 'lightblue' }}>
        Box
      </div>
      <div>Height: {height}px</div>
    </>
  );
}


useLayoutEffect sayesinde, box’un yüksekliği ölçülür ve state güncellenir,
bu da paint öncesi gerçekleşir.

*/

/*
useLayoutEffect ve SSR (Server Side Rendering)
SSR’de (örneğin Next.js gibi) useLayoutEffect çalışmaz çünkü:
useLayoutEffect DOM’a erişir ve DOM sunucuda yoktur,
React bu yüzden uyarı verir.
Bu durumda ya useEffect kullanırsın ya da client-side render sonrası çalıştırırsın.
React uyarısı:
"Warning: useLayoutEffect does nothing on the server..."


Kullanıcı ekran boyutuna göre width değişir.
İşte bu gibi durumlarda senin style ile verdiğin değer değil, gerçekte çizilen değer önemlidir.
Bir diğer önemli sebep: Platform Farkları
Android ve iOS bazen padding, border, scaling gibi şeylerde küçük farklar yapar.
Sen 120 dedin diye gerçekten 120 olabilir ama küçük bir layout farkı da olabilir.
onLayout, DOM (native view) render edildikten sonra bu gerçek sonucu verir.
Bir diğer önemli sebep: Platform Farkları
Android ve iOS bazen padding, border, scaling gibi şeylerde küçük farklar yapar.
Sen 120 dedin diye gerçekten 120 olabilir ama küçük bir layout farkı da olabilir.
onLayout, DOM (native view) render edildikten sonra bu gerçek sonucu verir.

*/

//useDebugValue

/*
useDebugValue(value)
useDebugValue can be used to display a label for custom hooks in React DevTools.
For example, consider the useFriendStatus custom Hook described in “Building Your Own Hooks”:
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
Tip
We don’t recommend adding debug values to every custom Hook. It’s most valuable for 
custom Hooks that are part of shared libraries.

Defer formatting debug values
In some cases formatting a value for display might be an expensive operation.
 It’s also unnecessary unless a Hook is actually inspected.
For this reason useDebugValue accepts a formatting function as an optional second 
parameter. This function is only called if the Hooks are inspected. It receives the
 debug value as a parameter and should return a formatted display value.
For example a custom Hook that returned a Date value could avoid calling the 
toDateString function unnecessarily by passing the following formatter:
useDebugValue(date, date => date.toDateString());

*/

/*
useDebugValue, özel hook’ların React DevTools içindeki görünümüne 
etiket (label) eklemek için kullanılır.
Sadece DevTools içindir – kullanıcıya veya UI'a etkisi yoktur.

Kullanım Senaryosu
Örneğin bir özel hook düşün:
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // Bağlantı durumunu DevTools'da göstermek için
  useDebugValue(isOnline ? '🟢 Online' : '🔴 Offline');

  return isOnline;
}
Bu hook’u bir bileşende kullanırsan, React DevTools sana hook’lar kısmında:
useFriendStatus ▶ 🟢 Online
şeklinde bilgi gösterir. Bu, özellikle karmaşık uygulamalarda büyük kolaylık sağlar.



Format Fonksiyonu Kullanımı
Bazı durumlarda değerlerin biçimlendirilmesi pahalı olabilir (örneğin tarih, 
JSON vb.). Bu yüzden ikinci parametre olarak lazy formatting function verebilirsin.
Örnek:
function useCurrentDate() {
  const [date, setDate] = useState(new Date());

  useDebugValue(date, (d) => d.toLocaleDateString());

  return date;
}
👉 Bu formatlama sadece DevTools'da bakıldığında çalışır. Performans kazancı sağlar.

| Kullan                                                                   | Kullanma                       |
| ------------------------------------------------------------------------ | ------------------------------ |
| Ortak bir custom hook'un varsa (örn. `useAuth`, `useTheme`, `useSocket`) | Her küçük hook için gerekmez   |
| Hook’un sonucu karmaşıksa ve DevTools'da anlaşılır görünmesi önemliyse   | Zaten anlaşılırsa veya küçükse |

*/



//useDeferredValue

/*
const deferredValue = useDeferredValue(value);
useDeferredValue accepts a value and returns a new copy of the value that will 
defer to more urgent updates. If the current render is the result of an urgent 
update, like user input, React will return the previous value and then render 
the new value after the urgent render has completed.
This hook is similar to user-space hooks which use debouncing or throttling to 
defer updates. The benefits to using useDeferredValue is that React will work 
on the update as soon as other work finishes (instead of waiting for an arbitrary 
amount of time), and like startTransition, deferred values can suspend without 
triggering an unexpected fallback for existing content.
Memoizing deferred children
useDeferredValue only defers the value that you pass to it. If you want to prevent
 a child component from re-rendering during an urgent update, you must also memoize 
 that component with React.memo or React.useMemo:
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
Memoizing the children tells React that it only needs to re-render them when
 deferredQuery changes and not when query changes. This caveat is not unique
  to useDeferredValue, and it’s the same pattern you would use with similar 
  hooks that use debouncing or throttling.


  useDeferredValue bir değer alır ve o değerin, daha acil güncellemelere öncelik
   vererek ertelenmiş yeni bir kopyasını döndürür. Eğer şu anki render işlemi, 
   kullanıcı girdisi gibi acil bir güncellemeden kaynaklanıyorsa, React önceki
    değeri döndürür ve acil render işlemi tamamlandıktan sonra yeni değeri render eder.

Bu hook, kullanıcı tarafında debounce (geciktirme) veya throttle (sınırlama) yapan 
benzer hook’lara benzer. useDeferredValue kullanmanın avantajı, React’in güncellemeyi
 belirli bir süre beklemek yerine, diğer işler bittikten sonra hemen yapmasıdır. 
 Ayrıca, startTransition gibi, ertelenmiş değerler bekleyebilir (suspend) ve mevcut 
 içeriği beklenmedik şekilde değiştiren fallback’ler tetiklemez.


useDeferredValue sadece kendisine verilen değeri erteler. Eğer bir acil güncelleme 
sırasında, bir çocuk komponentin yeniden render edilmesini önlemek istiyorsan, 
o komponenti React.memo veya React.useMemo ile de memoize etmelisin.

// Memoize etmek React’a, sadece deferredQuery değiştiğinde yeniden render yapması gerektiğini söyler,
  // query değiştiğinde değil.. Bu durum useDeferredValue’ya özgü değil, debounce 
  // veya throttle kullanan benzer hook’larda da aynı kalıp kullanılır.

*/

/*
1. useDeferredValue Nedir?
React 18 ile gelen bu hook, UI performansını artırmak için tasarlanmıştır. Kullanıcı 
arayüzündeki bazı güncellemeleri "erteler" yani önceliklendirme yapar. Örneğin kullanıcı 
yazı yazarken hızlıca input’u güncellemek "acil" güncellemedir. Ama o input’a bağlı 
ağır bir liste veya filtreleme varsa, o işlem ertelenebilir.
Acil güncelleme: Kullanıcı anlık yazı yazıyor, hemen gösterilmeli.
Ertelenmiş güncelleme: Yazılan yazıya bağlı yavaş, maliyetli hesaplama.
useDeferredValue bu yavaş hesaplamayı acil iş bittikten sonra yapmaya iter. Böylece 
UI daha akıcı olur.
2. useDeferredValue Nasıl Çalışır?
Sen bir value verir, hook o değerin "ertelenmiş" bir kopyasını döner.
Eğer render acilse (örneğin input değişikliği), React önce önceki değeri kullanır.
Acil işler bittiğinde yeni değerle render yapar.
3. Neden Memoize Etmek Gerekir?
useDeferredValue sadece değeri erteler ama o değeri alan çocuk komponent otomatik '
olarak memoize olmaz. Yani:
Eğer çocuk komponent memoize edilmezse, ana komponent her render olduğunda çocuk da 
yeniden render olur.
Memoize edilirse, çocuk sadece ertelenmiş değer (deferredValue) değişirse render olur,
 böylece performans artar.
4. startTransition ve Suspense ile İlişkisi
useDeferredValue, React’in startTransition API’sine benzer. Bu API’lar:
UI’da önemli (acil) işleri hızlı gösterip,
Daha az önemli işleri arka planda işler.
Ayrıca, ertelenmiş işler Suspense ile sarkabilir (bekleyebilir), ama fallback’leri 
beklenmedik göstermez.
5. Örnek Senaryo
Kullanıcı arayüzünde anlık yazı yazıyor (acil), ama o yazıya göre filtrelenen öneriler 
listesi büyük ve hesaplaması yavaş.
query anlık değişir.
deferredQuery bir süre ertelenir.
SearchSuggestions sadece deferredQuery değiştiğinde yeniden render olur.
Kullanıcı arayüzü yavaşlamaz, akıcı çalışır.
Özet
useDeferredValue ağır hesaplamaları veya renderları acil işler bittikten sonra yapmak için kullanılır.
Performans optimizasyonu sağlar.
Çocuk komponentlerin yeniden renderını engellemek için memoize edilmesi gerekir.
React DevTools ve Suspense ile uyumludur.

*/

/*
useDeferredValue kullandığında, React acil işler (örneğin kullanıcı yazarken 
input güncellemesi) öncelikli olarak yapılır, filtreleme gibi ağır ve yavaş 
işlemler ise biraz gecikmeli yani “ertelenmiş” şekilde gerçekleştirilir.
Bu gecikme, input’a anında hızlı yanıt vermeni sağlar; kullanıcı yazarken UI 
donmaz veya takılmaz. Filtreleme, kullanıcı yazmayı bıraktığında veya biraz
 yavaşladığında arka planda yapılır ve sonuçlar güncellenir.

Kısaca:

Anlık kullanıcı girdisi → hemen render
Ağır işlemler (filtreleme, hesaplama) → gecikmeli, arka planda
Böylece uygulama daha akıcı olur, performans iyileşir.
*/


//useTransition
