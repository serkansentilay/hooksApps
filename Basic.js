/*
Note
Unlike the setState method found in class components, useState does not 
automatically merge update objects. You can replicate this behavior by 
combining the function updater form with object spread syntax:
const [state, setState] = useState({});
setState(prevState => {
  // Object.assign would also work
  return {...prevState, ...updatedValues};
});
Another option is useReducer, which is more suited for managing state objects 
that contain multiple sub-values.
*/

/*
In the rare case that you need to force the DOM update to be applied 
synchronously, you may wrap it in flushSync. However, this can hurt 
performance so do this only where needed.

*/

/*
useEffect(didUpdate);
Accepts a function that contains imperative, possibly effectful code.
Mutations, subscriptions, timers, logging, and other side effects are not
 allowed inside the main body of a function component (referred to as React’s 
 render phase). Doing so will lead to confusing bugs and inconsistencies in the UI.
Instead, use useEffect. The function passed to useEffect will run after the 
render is committed to the screen. Think of effects as an escape hatch from
 React’s purely functional world into the imperative world.
By default, effects run after every completed render, but you can choose to
 fire them only when certain values have changed.

*/


/*
Cleaning up an effect
Often, effects create resources that need to be cleaned up before the component
leaves the screen, such as a subscription or timer ID. To do this, the function 
passed to useEffect may return a clean-up function. For example, to create a subscription:
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
The clean-up function runs before the component is removed from the UI to prevent
 memory leaks. Additionally, if a component renders multiple times (as they 
 typically do), the previous effect is cleaned up before executing the next effect.
  In our example, this means a new subscription is created on every update. To 
  avoid firing an effect on every update, refer to the next section.

*/


/*
Timing of effects
Unlike componentDidMount and componentDidUpdate, the function passed to useEffect 
fires after layout and paint, during a deferred event. This makes it suitable for 
the many common side effects, like setting up subscriptions and event handlers,
 because most types of work shouldn’t block the browser from updating the screen.
However, not all effects can be deferred. For example, a DOM mutation that is visible
 to the user must fire synchronously before the next paint so that the user does not 
 perceive a visual inconsistency. (The distinction is conceptually similar to passive
  versus active event listeners.) For these types of effects, React provides one additional
   Hook called useLayoutEffect. It has the same signature as useEffect, and only differs in
    when it is fired.
Additionally, starting in React 18, the function passed to useEffect will fire synchronously 
before layout and paint when it’s the result of a discrete user input such as a click, or 
when it’s the result of an update wrapped in flushSync. This behavior allows the result of
 the effect to be observed by the event system, or by the caller of flushSync.
Note
This only affects the timing of when the function passed to useEffect is called - updates
 scheduled inside these effects are still deferred. This is different than useLayoutEffect,
  which fires the function and processes the updates inside of it immediately.
Even in cases where useEffect is deferred until after the browser has painted, it’s
 guaranteed to fire before any new renders. React will always flush a previous render’s 
 effects before starting a new update.


 Efektlerin zamanlaması
componentDidMount ve componentDidUpdate‘in aksine, useEffect içine girilen fonksiyon
 ekrana yazdırma işleminden sonra, gecikmeli bir olay olarak çalışır. Bu useEffect‘i
  birçok yaygın yan etki için uygun getirir, mesela aboneliklerin ve olay yöneticilerinin
   oluşturulması, çünkü birçok işlem türü aslında tarayıcının ekranı güncellemesini engellememelidir.
Buna rağmen, tüm efekler ertelenemeyebilir. Örneğin, kullanıcının görebildiği, DOM 
üzerindeki bir değişiklik bir sonraki ekrana yazdırma aşamasından önce gerçekleşmelidir 
ki kullanıcı görsel bir uyumsuzluk yaşamasın. (Aradaki ayırım konsept olarak pasif vs.
 aktif olay dinleyicilerine benzer.) Bu tip efekler için React, useLayoutEffect adında
  başka bir hook daha sağlar. Bu hook da useEffect ile aynı şekilde çalışır, sadece ne 
  zaman çalıştırılacağı farklıdır.
Ayrıca, React 18 ile birlikte, useEffect içine geçirilen fonksiyon, bir tıklama gibi
 ayrık (discrete) bir kullanıcı girdisinin sonucu olduğunda ya da flushSync içine 
 sarılmış bir güncellemenin sonucu olduğunda, yerleşim (layout) ve boyama (paint) 
 işlemlerinden önce senkron bir şekilde çalışır.
Bu davranış, efektin sonucunun olay sistemi (event system) veya flushSync'i çağıran
 tarafından gözlemlenebilmesini sağlar.

Not:
Bu yalnızca useEffect içine verilen fonksiyonun ne zaman çalıştırıldığını etkiler — bu 
efektler içinde zamanlanan güncellemeler yine de ertelenir.
Bu durum, fonksiyonu çalıştıran ve içindeki güncellemeleri anında işleyen 
useLayoutEffect'ten farklıdır.
useEffect tarayıcı ekrana yazdırma işlemini tamamlanana kadar geciktirilmiş olmasına 
rağmen, herhangi bir yeniden-render işleminden önce çalışması da garanti edilir. React
 her zaman bir önceki render işleminin efektlerini, yeni bir güncellemeye başlamadan
  önce temizleyecektir.


*/



/*
Conditionally firing an effect
The default behavior for effects is to fire the effect after every completed render. 
That way an effect is always recreated if one of its dependencies changes.
However, this may be overkill in some cases, like the subscription example from the 
previous section. We don’t need to create a new subscription on every update, only 
if the source prop has changed.
To implement this, pass a second argument to useEffect that is the array of values 
that the effect depends on. Our updated example now looks like this:
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
Now the subscription will only be recreated when props.source changes.
Note
If you use this optimization, make sure the array includes all values from the 
component scope (such as props and state) that change over time and that are used 
by the effect. Otherwise, your code will reference stale values from previous renders. 
Learn more about how to deal with functions and what to do when the array values change too often.
If you want to run an effect and clean it up only once (on mount and unmount), you 
can pass an empty array ([]) as a second argument. This tells React that your effect
 doesn’t depend on any values from props or state, so it never needs to re-run. This 
 isn’t handled as a special case — it follows directly from how the dependencies array always works.
If you pass an empty array ([]), the props and state inside the effect will always 
have their initial values. While passing [] as the second argument is closer to the 
familiar componentDidMount and componentWillUnmount mental model, there are usually 
better solutions to avoid re-running effects too often. Also, don’t forget that React
 defers running useEffect until after the browser has painted, so doing extra work 
 is less of a problem.
We recommend using the exhaustive-deps rule as part of our eslint-plugin-react-hooks 
package. It warns when dependencies are specified incorrectly and suggests a fix.
The array of dependencies is not passed as arguments to the effect function. Conceptually,
 though, that’s what they represent: every value referenced inside the effect function 
 should also appear in the dependencies array. In the future, a sufficiently advanced 
 compiler could create this array automatically.

Eğer bu optimizasyonu kullanırsanız, diziye bileşenin içindeki zaman içinde değişen ve 
efekt içinde kullanılan tüm değerleri dahil etmeyi unutmayın. Aksi takdirde kodunuz bir 
önceki render işleminden kalma geçerliliğini yitirmiş değerlere referans gösterecektir. 
Fonksiyonlarla nasıl çalışılır ve dizinin değerleri çok sık değiştiğinde ne yapılır 
konuları hakkında daha fazla bilgi edinin.
Bir efekti yalnızca bir kere çalıştırıp temizlemek istediğinizde (mount ve unmount 
aşamalarında), ikinci argüman olarak boş bir dizi ([]) gönderebilirsiniz. Böylece 
React’a, efektin state veya props içindeki hiçbir değere bağlı olmadığını söylemiş 
olursunuz, böylece efekt hiçbir zaman yeniden çalıştırılmaz. Bu özel bir durum 
değildir — bağımlı değişkenler dizisinin çalışma prensibi bu şekildedir.

*/


//useContext
/*
const value = useContext(MyContext);
Accepts a context object (the value returned from React.createContext) and 
returns the current context value for that context. The current context value
is determined by the value prop of the nearest <MyContext.Provider> above the
 calling component in the tree.
When the nearest <MyContext.Provider> above the component updates, this Hook
 will trigger a rerender with the latest context value passed to that MyContext
  provider. Even if an ancestor uses React.memo or shouldComponentUpdate, 
  a rerender will still happen starting at the component itself using useContext.
Don’t forget that the argument to useContext must be the context object itself:
Correct: useContext(MyContext)
Incorrect: useContext(MyContext.Consumer)
Incorrect: useContext(MyContext.Provider)
A component calling useContext will always re-render when the context value changes.
 If re-rendering the component is expensive, you can optimize it by using memoization.
Tip
If you’re familiar with the context API before Hooks, useContext(MyContext) is
 equivalent to static contextType = MyContext in a class, or to <MyContext.Consumer>.
useContext(MyContext) only lets you read the context and subscribe to its changes.
You still need a <MyContext.Provider> above in the tree to provide the value for this context.
Putting it together with Context.Provider
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
This example is modified for hooks from a previous example in the Context
 Advanced Guide, where you can find more information about when and how to use Context.

*/

/*
When to Use Context
Context is designed to share data that can be considered “global” for
 a tree of React components, such as the current authenticated user, 
 theme, or preferred language. For example, in the code below we manually 
 thread through a “theme” prop in order to style the Button component:
class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // The Toolbar component must take an extra "theme" prop
  // and pass it to the ThemedButton. This can become painful
  // if every single button in the app needs to know the theme
  // because it would have to be passed through all components.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
Bu yöntemde, theme verisi App ➝ Toolbar ➝ ThemedButton şeklinde elle geçirilmek zorunda.
 Eğer Toolbar'ın içinde 10 farklı bileşen varsa, hepsine theme geçirmek büyük zahmet.

Using context, we can avoid passing props through intermediate elements:
// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current theme (with "light" as the default).


const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // Use a Provider to pass the current theme to the tree below.
    // Any component can read it, no matter how deep it is.
    // In this example, we're passing "dark" as the current value.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // Assign a contextType to read the current theme context.
  // React will find the closest theme Provider above and use its value.
  // In this example, the current theme is "dark".
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}

Burada ThemeContext.Provider ile dark teması "global olarak" tüm alt bileşenlere sağlanıyor.
ThemedButton, contextType sayesinde en yakın Provider'dan theme bilgisini çekiyor.
Artık Toolbar'a ya da başka bileşenlere theme prop'u geçirmek zorunda değilsin.

*/

/*
 React Context API Nedir, Ne İşe Yarar?

React'te veriler normalde yukarıdan aşağıya (parent ➝ child) doğru, yani 
props aracılığıyla bileşenler arasında aktarılır.

Bu yöntem genellikle işe yarar ama bazı durumlarda çok zahmetli hale gelir. Özellikle;

Uygulama dili (locale),
Tema (dark/light),
Giriş yapmış kullanıcı bilgisi (authenticated user),
gibi birçok bileşen tarafından erişilmesi gereken veriler için her seviyeye 
props geçirmek çok karmaşık hale gelebilir.

İşte bu noktada Context API devreye girer.

✅ Context API ile Ne Yapılır?
Context API sayesinde bir veriyi (örneğin tema, dil vs.) tüm bileşen ağacına 
(component tree) tek bir noktadan global olarak ulaştırabilirsin. Böylece 
props zinciriyle uğraşmazsın.


*/


/*
Context, uygulama genelinde paylaşılması gereken veriler için idealdir 
(örneğin: tema, dil, kullanıcı bilgisi).
Tema ve locale için Context kullanımı tamamen doğrudur ve önerilir.
Ancak çok sık değişen veriler için Context performans sorunlarına neden olabilir.
Class component’lerde contextType, function component’lerde useContext ile kullanılır.
*/

/*
Ne Zaman Context Kullanmalı?

Kullanıcı teması (dark / light)
Dil seçimi (en, tr)
Giriş yapmış kullanıcı bilgisi
Küçük projeler ya da az değişen veri
🔸 Context, bir “state management” çözümü değildir. Sadece global “prop aktarımı” kolaylaştırır.
🧠 Ne Zaman Redux Kullanmalı?

Karmaşık iş mantığı olan uygulamalar
Çok sayıda bileşenin etkilediği ortak durumlar (örneğin: alışveriş sepeti, 
kullanıcı oturumu, filtreleme vs.)
İleri düzey side-effect yönetimi gerekiyorsa (API çağrıları, async işlemler)
Veriyi merkezi bir noktadan yönetmek istiyorsan
*/

/*
Before You Use Context
Context is primarily used when some data needs to be accessible by many components
 at different nesting levels. Apply it sparingly because it makes component reuse more difficult.
If you only want to avoid passing some props through many levels, component 
composition is often a simpler solution than context.
For example, consider a Page component that passes a user and avatarSize prop several 
levels down so that deeply nested Link and Avatar components can read it:

Context Kullanmadan Önce
Context esas olarak, bazı verilerin farklı düzeylerdeki iç içe geçmiş birçok bileşen 
tarafından erişilebilir olması gerektiğinde kullanılır. Bileşenin yeniden kullanımını 
zorlaştırdığından onu ölçülü bir şekilde uygulayın.
Yalnızca bazı prop’ları birçok aşama üzerinden geçmek istemezseniz, bileşen kompozisyonu 
genellikle Context’ten daha basit bir çözümdür.
Örneğin, derinlemesine iç içe geçmiş Link ve Avatar bileşenlerinin okuyabilmesi için 
avatarSize ve user prop’larını birkaç seviye aşağıya aktaran bir Page bileşeni düşünün:

<Page user={user} avatarSize={avatarSize} />
// ... which renders ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... which renders ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... which renders ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
It might feel redundant to pass down the user and avatarSize props through many 
levels if in the end only the Avatar component really needs it. It’s also annoying 
that whenever the Avatar component needs more props from the top, you have to add 
them at all the intermediate levels too.
One way to solve this issue without context is to pass down the Avatar component 
itself so that the intermediate components don’t need to know about the user or avatarSize props:
Sonunda sadece Avatar bileşeni ihtiyaç duyuyorsa, user ve avatarSize ‘ın birçok seviyeden
 geçmesi gereksiz olabilir. Ayrıca Avatar bileşeni yukarıdan daha fazla prop’a ihtiyaç 
 duyduğunda, bu prop’ları tüm ara seviyelerde de eklemeniz gerekir.
Bu sorunu Context’siz çözmenin bir yolu Avatar bileşeninin kendisinin prop olarak geçil
mesidir, böylece ara bileşenlerin user ve avatarSize prop’ları hakkında bilgi sahibi olması gerekmez:

function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Now, we have:
<Page user={user} avatarSize={avatarSize} />
// ... which renders ...
<PageLayout userLink={...} />
// ... which renders ...
<NavigationBar userLink={...} />
// ... which renders ...
{props.userLink}
With this change, only the top-most Page component needs to know about the Link
 and Avatar components’ use of user and avatarSize.
This inversion of control can make your code cleaner in many cases by reducing
 the amount of props you need to pass through your application and giving more 
 control to the root components. Such inversion, however, isn’t the right choice in 
 every case; moving more complexity higher in the tree makes those higher-level 
 components more complicated and forces the lower-level components to be more flexible
  than you may want.
You’re not limited to a single child for a component. You may pass multiple children,
 or even have multiple separate “slots” for children, as documented here:
 Bu değişiklikle birlikte sadece en üstteki Page bileşeni Link ve Avatar bileşenlerinin 
 user ve avatarSize kullanımını bilmesi gerekir.
Bu kontrolün tersine çevrilmesi, birçok durumda uygulamanızdan geçirmeniz gereken 
prop’ların sayısını azaltarak ve kök bileşenlere daha fazla kontrol sağlayarak kodunuzu
 daha temiz hale getirebilir. Fakat bu her durumda doğru bir seçim değildir: bileşen
  ağacında daha fazla karmaşıklık taşımak, daha üst seviyeli bileşenleri daha karmaşık
   hale getirir ve daha düşük seviyeli bileşenleri istediğinizden daha esnek olmaya zorlar.
Bir bileşen için tek bir alt elemanla sınırlı değilsiniz. Burada belirtildiği gibi,
 alt elemanlar için birden çok alt eleman geçirebilirsiniz, hatta alt bileşenler için 
 birden fazla ayrı “slots”a sahip olabilirsiniz.

function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
This pattern is sufficient for many cases when you need to decouple a child from
 its immediate parents. You can take it even further with render props if the child 
 needs to communicate with the parent before rendering.
However, sometimes the same data needs to be accessible by many components in the 
tree, and at different nesting levels. Context lets you “broadcast” such data, and
 changes to it, to all components below. Common examples where using context might 
 be simpler than the alternatives include managing the current locale, theme, or a data cache.
Bu model, bir alt elemanı üst elemanlarından ayırmanız gerektiğinde çoğu durum için 
yeterlidir. Alt elemanın render olmadan önce üst eleman ile iletişim kurması gerekiyorsa, 
bunu render prop’larla daha ileriye götürebilirsin.
Fakat, bazen aynı verinin ağaçtaki birçok bileşen tarafından ve farklı iç içe geçmiş 
seviyelerinde erişilebilir olması gerekir. Context, bu tür verileri ve güncellemeleri 
ağaçtaki tüm bileşenlere “yaymanızı” sağlar. Context kullanımının diğer alternatiflerden
 daha basit olabileceği ortak örnekler arasında konum ayarlarının yönetimi, tema veya 
 veri önbelleği bulunur.

*/

/*
1. 📦 Prop Drilling (Props Zinciri ile)
function App() {
  const user = { name: "Serkan", permalink: "/serkan" };
  return <Page user={user} avatarSize={40} />;
}

function Page({ user, avatarSize }) {
  return <PageLayout user={user} avatarSize={avatarSize} />;
}

function PageLayout({ user, avatarSize }) {
  return <NavigationBar user={user} avatarSize={avatarSize} />;
}

function NavigationBar({ user, avatarSize }) {
  return (
    <Link href={user.permalink}>
      <Avatar user={user} size={avatarSize} />
    </Link>
  );
}

function Avatar({ user, size }) {
  return (
    <div>
      <p>{user.name}</p>
      <img src={`https://placehold.co/${size}x${size}`} alt={user.name} />
    </div>
  );
}

function Link({ href, children }) {
  return <a href={href}>{children}</a>;
}
🧠 Sorun ne?
user ve avatarSize bilgisi sadece en alttaki Avatar bileşeninde kullanılıyor.
Ama hepsi tek tek 4 seviyeden geçiyor → App → Page → PageLayout → NavigationBar → Avatar
2. 🧩 Component Composition (Bileşeni Yukarıdan Geçerek)
function App() {
  const user = { name: "Serkan", permalink: "/serkan" };
  const avatarSize = 40;

  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={avatarSize} />
    </Link>
  );

  return <Page userLink={userLink} />;
}

function Page({ userLink }) {
  return <PageLayout userLink={userLink} />;
}

function PageLayout({ userLink }) {
  return <NavigationBar userLink={userLink} />;
}

function NavigationBar({ userLink }) {
  return userLink; // sadece render ediyor, user bilgisine ihtiyacı yok!
}

function Avatar({ user, size }) {
  return (
    <div>
      <p>{user.name}</p>
      <img src={`https://placehold.co/${size}x${size}`} alt={user.name} />
    </div>
  );
}

function Link({ href, children }) {
  return <a href={href}>{children}</a>;
}

*/

/*
React.createContext
const MyContext = React.createContext(defaultValue);
Creates a Context object. When React renders a component that subscribes to 
this Context object it will read the current context value from the closest 
matching Provider above it in the tree.
The defaultValue argument is only used when a component does not have a matching 
Provider above it in the tree. This default value can be helpful for testing 
components in isolation without wrapping them. Note: passing undefined as 
a Provider value does not cause consuming components to use defaultValue.

*/

/*
Context.Provider
<MyContext.Provider value={// some value}>
Every Context object comes with a Provider React component that allows consuming 
components to subscribe to context changes.
The Provider component accepts a value prop to be passed to consuming components
 that are descendants of this Provider. One Provider can be connected to many consumers.
  Providers can be nested to override values deeper within the tree.
All consumers that are descendants of a Provider will re-render whenever the 
Provider’s value prop changes. The propagation from Provider to its descendant
 consumers (including .contextType and useContext) is not subject to the 
 shouldComponentUpdate method, so the consumer is updated even when an ancestor
  component skips an update.
Changes are determined by comparing the new and old values using the same algorithm as Object.is.
Note
The way changes are determined can cause some issues when passing objects as value: see Caveats.

Caveats
Because context uses reference identity to determine when to re-render, there are
some gotchas that could trigger unintentional renders in consumers when a 
provider’s parent re-renders. For example, the code below will re-render all
 consumers every time the Provider re-renders because a new object is always created for value:
class App extends React.Component {
  render() {
    return (
      <MyContext.Provider value={{something: 'something'}}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
To get around this, lift the value into the parent’s state:
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},
    };
  }

  render() {
    return (
      <MyContext.Provider value={this.state.value}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
*/

/*
Consuming Multiple Contexts
To keep context re-rendering fast, React needs to make each context consumer 
a separate node in the tree.
// Theme context, default to light theme
const ThemeContext = React.createContext('light');

// Signed-in user context
const UserContext = React.createContext({
  name: 'Guest',
});

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // App component that provides initial context values
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// A component may consume multiple contexts
function Content() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
If two or more context values are often used together, you might want to consider 
creating your own render prop component that provides both.

*/

/*
Class.contextType
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    // perform a side-effect at mount using the value of MyContext 
  }
  componentDidUpdate() {
    let value = this.context;
    //
  }
  componentWillUnmount() {
    let value = this.context;
    //
  }
  render() {
    let value = this.context;
    // render something based on the value of MyContext 
  }
}
MyClass.contextType = MyContext;
The contextType property on a class can be assigned a Context object created 
by React.createContext(). Using this property lets you consume the nearest 
current value of that Context type using this.context. You can reference this 
in any of the lifecycle methods including the render function.

class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    // render something based on the value 
  }
}
*/

/*
Context.Consumer
<MyContext.Consumer>
  {value => // render something based on the context value }
</MyContext.Consumer>
A React component that subscribes to context changes. Using this component lets 
you subscribe to a context within a function component.
Requires a function as a child. The function receives the current context value and 
returns a React node. The value argument passed to the function will be equal to the
 value prop of the closest Provider for this context above in the tree. If there is 
 no Provider for this context above, the value argument will be equal to the defaultValue 
 that was passed to createContext().

Context değişikliklerine abone olan bir React bileşeni. Bu bileşeni kullanmak, bir 
fonksiyon bileşen içindeki bir context’e abone olmanıza izin verir.
Alt eleman olarak fonksiyon verilmesine ihtiyaç duyar. Fonksiyon geçerli context değerini 
alır ve bir React düğümü döndürür. Fonksiyona iletilen value argümanı, yukarıda bu context 
için ağaçta en yakın Provider’ın value prop’una eşit olacaktır. Yukarıdaki bu context 
için Provider yoksa, value argümanı createContext() öğesine iletilmiş defaultValue değerine eşit olur.

*/

/*
Context.displayName
Context object accepts a displayName string property. React DevTools uses this string to determine what to display for the context.
For example, the following component will appear as MyDisplayName in the DevTools:
const MyContext = React.createContext(// some value );
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
*/

//Render Props

/*
The term “render prop” refers to a technique for sharing code between React 
components using a prop whose value is a function.
A component with a render prop takes a function that returns a React element 
and calls it instead of implementing its own render logic.
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
Libraries that use render props include React Router, Downshift and Formik.


*/


/*
Use Render Props for Cross-Cutting Concerns
Components are the primary unit of code reuse in React, but it’s not always 
obvious how to share the state or behavior that one component encapsulates to 
other components that need that same state.
For example, the following component tracks the mouse position in a web app:
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
As the cursor moves around the screen, the component displays its (x, y) coordinates in a <p>.
Now the question is: How can we reuse this behavior in another component? In other 
words, if another component needs to know about the cursor position, can we encapsulate 
that behavior so that we can easily share it with that component?
Since components are the basic unit of code reuse in React, let’s try refactoring the
 code a bit to use a <Mouse> component that encapsulates the behavior we need to reuse elsewhere.
// The <Mouse> component encapsulates the behavior we need...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {// ...but how do we render something other than a <p>? }
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </>
    );
  }
}
Now the <Mouse> component encapsulates all behavior associated with listening for 
mousemove events and storing the (x, y) position of the cursor, but it’s not yet truly reusable.
For example, let’s say we have a <Cat> component that renders the image of a cat 
chasing the mouse around the screen. We might use a <Cat mouse={{ x, y }}> prop to 
tell the component the coordinates of the mouse so it knows where to position the image on the screen.
As a first pass, you might try rendering the <Cat> inside <Mouse>’s render method, like this:
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {
         // We could just swap out the <p> for a <Cat> here ... but then
         // we would need to create a separate <MouseWithSomethingElse>
         // component every time we need to use it, so <MouseWithCat>
         // isn't really reusable yet.
        }
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
This approach will work for our specific use case, but we haven’t achieved the
 objective of truly encapsulating the behavior in a reusable way. Now, every time 
 we want the mouse position for a different use case, we have to create a new component 
 (i.e. essentially another <MouseWithCat>) that renders something specifically for that use case.
Here’s where the render prop comes in: Instead of hard-coding
 a <Cat> inside a <Mouse> component, and effectively changing its rendered output,
  we can provide <Mouse> with a function prop that it uses to dynamically determine 
  what to render–a render prop.
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {
         // Instead of providing a static representation of what <Mouse> renders,
         // use the `render` prop to dynamically determine what to render.
        }
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
Now, instead of effectively cloning the <Mouse> component and hard-coding something 
else in its render method to solve for a specific use case, we provide a render prop 
that <Mouse> can use to dynamically determine what it renders.
More concretely, a render prop is a function prop that a component uses to know what to render.
This technique makes the behavior that we need to share extremely portable. To get 
that behavior, render a <Mouse> with a render prop that tells it what to render with 
the current (x, y) of the cursor.
One interesting thing to note about render props is that you can implement most
 higher-order components (HOC) using a regular component with a render prop. 
 For example, if you would prefer to have a withMouse HOC instead of a <Mouse> component, 
 you could easily create one using a regular <Mouse> with a render prop:
// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
So using a render prop makes it possible to use either pattern.

*/

/*
Using Props Other Than render
It’s important to remember that just because the pattern is called “render props” 
you don’t have to use a prop named render to use this pattern. In fact, any prop 
that is a function that a component uses to know what to render is technically a “render prop”.
Although the examples above use render, we could just as easily use the children prop!
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
And remember, the children prop doesn’t actually need to be named in the list of 
“attributes” in your JSX element. Instead, you can put it directly inside the element!
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
You’ll see this technique used in the react-motion API.
Since this technique is a little unusual, you’ll probably want to explicitly state
 that children should be a function in your propTypes when designing an API like this.
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};

*/

/*
 Render Props Nedir?

Render Prop, bir bileşene bir fonksiyon prop’u vererek, o fonksiyonun içinde
 bileşenin ne render edeceğini tanımlamanı sağlayan bir React desenidir.

👉 Kısaca:

"Bana mouse pozisyonunu ver, ben onunla ne yapacağımı söylerim."
🎯 Problem: Yeniden Kullanılabilir Davranış

React bileşenleri genelde UI (görsel) bileşenlerdir. Ancak bazı bileşenler 
davranış (behavior) barındırır:

Fare konumunu takip etmek
Scroll pozisyonunu dinlemek
Bir API çağrısını yapmak vs.
Bu tarz davranışları her bileşene ayrı ayrı yazmak kod tekrarına neden olur.

İşte bu davranışı kapsülleyip farklı yerlerde yeniden kullanmak istiyoruz.

⚡ Render Props Olmadan (Klasik Problem)

class MouseWithCat extends React.Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (e) => {
    this.setState({ x: e.clientX, y: e.clientY });
  };

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        <Cat mouse={this.state} />
      </div>
    );
  }
}
Bu çalışır ama her yeni ihtiyacın için farklı MouseXyz bileşeni oluşturmak 
zorundasın (örneğin MouseWithTooltip, MouseWithBox vs.)

Yani bu yöntemle davranış yeniden kullanılabilir değil.

✅ Render Props ile Aynı İşlev: Daha Temiz

class Mouse extends React.Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (e) => {
    this.setState({ x: e.clientX, y: e.clientY });
  };

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}
Kullanımı:

<Mouse render={mouse => <Cat mouse={mouse} />} />
🧩 Bu sayede Mouse bileşeni sadece davranıştan sorumlu, neyin çizileceğine üst bileşen karar veriyor.
Böylece aynı Mouse bileşeni, istediğin her şeyle çalışabilir: <Cat />, <Tooltip />, <CursorTracker />...
🧩 Children ile Render Prop Kullanmak

Aynı şeyi children prop'u ile de yapabilirsin:

<Mouse>
  {mouse => (
    <p>Mouse is at {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
Bunun avantajı:

children zaten JSX'te özel bir prop olduğu için daha doğal yazım sağlar.
props.render(...) yerine doğrudan {mouse => ...} yazabilirsin.
🔁 Render Prop vs. Higher-Order Component (HOC)

Yukarıdaki davranışı HOC ile de yapabilirsin:

function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  };
}
Ama HOC'ler:

Component ağaçlarını sarmalayarak karmaşık hale getirebilir,
Props çatışmaları olabilir,
Kod okunabilirliğini düşürebilir.
O yüzden Render Prop, HOC yerine daha açık bir çözüm sunar.

🧪 Ne Zaman Render Props Kullanılır?

Bir davranışı paylaşmak istiyorsan: (örneğin scroll, mouse, resize, timer, async data)
UI değil, logic paylaşımı gerekiyorsa
HOC karmaşıklığından kaçmak istiyorsan
Birden çok farklı görünümde aynı davranışı kullanacaksan
🎁 PropTypes Kullanımı

Çünkü children normalde JSX öğesi bekler. Ama burada fonksiyon bekliyoruz. O yüzden netleştirmek için:

Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
Bu, children prop'unun bir fonksiyon olması gerektiğini açıkça belirtir.


*/

/*
Use Render Props for Cross-Cutting Concerns
Components are the primary unit of code reuse in React, but it’s not always 
obvious how to share the state or behavior that one component encapsulates to 
other components that need that same state.
For example, the following component tracks the mouse position in a web app:
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
As the cursor moves around the screen, the component displays its (x, y) coordinates in a <p>.
Now the question is: How can we reuse this behavior in another component? In other
 words, if another component needs to know about the cursor position, can we encapsulate
  that behavior so that we can easily share it with that component?
Since components are the basic unit of code reuse in React, let’s try refactoring 
the code a bit to use a <Mouse> component that encapsulates the behavior we need to reuse elsewhere.
// The <Mouse> component encapsulates the behavior we need...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {// ...but how do we render something other than a <p>? }
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </>
    );
  }
}
Now the <Mouse> component encapsulates all behavior associated with listening 
for mousemove events and storing the (x, y) position of the cursor, but it’s not yet truly reusable.
For example, let’s say we have a <Cat> component that renders the image of a cat
 chasing the mouse around the screen. We might use a <Cat mouse={{ x, y }}> prop 
 to tell the component the coordinates of the mouse so it knows where to position
  the image on the screen.
As a first pass, you might try rendering the <Cat> inside <Mouse>’s render method, like this:
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {
         // We could just swap out the <p> for a <Cat> here ... but then
         // we would need to create a separate <MouseWithSomethingElse>
         // component every time we need to use it, so <MouseWithCat>
         // isn't really reusable yet.
        }
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
This approach will work for our specific use case, but we haven’t achieved the 
objective of truly encapsulating the behavior in a reusable way. Now, every time
 we want the mouse position for a different use case, we have to create a new 
 component (i.e. essentially another <MouseWithCat>) that renders something
 specifically for that use case.
Here’s where the render prop comes in: Instead of hard-coding a <Cat> inside 
a <Mouse> component, and effectively changing its rendered output, we can provide 
<Mouse> with a function prop that it uses to dynamically determine what to render–a render prop.
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {
         // Instead of providing a static representation of what <Mouse> renders,
         //</Mouse> use the `render` prop to dynamically determine what to render.
        }
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
Now, instead of effectively cloning the <Mouse> component and hard-coding something
 else in its render method to solve for a specific use case, we provide a render 
 prop that <Mouse> can use to dynamically determine what it renders.
More concretely, a render prop is a function prop that a component uses to know what to render.
This technique makes the behavior that we need to share extremely portable. To get
 that behavior, render a <Mouse> with a render prop that tells it what to render with
  the current (x, y) of the cursor.
One interesting thing to note about render props is that you can implement most 
higher-order components (HOC) using a regular component with a render prop. For 
example, if you would prefer to have a withMouse HOC instead of a <Mouse> component,
 you could easily create one using a regular <Mouse> with a render prop:
// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
So using a render prop makes it possible to use either pattern.
Using Props Other Than render
It’s important to remember that just because the pattern is called “render props”
you don’t have to use a prop named render to use this pattern. In fact, any prop that 
is a function that a component uses to know what to render is technically a “render prop”.
Although the examples above use render, we could just as easily use the children prop!
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
And remember, the children prop doesn’t actually need to be named in the list of 
“attributes” in your JSX element. Instead, you can put it directly inside the element!
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
You’ll see this technique used in the react-motion API.
Since this technique is a little unusual, you’ll probably want to explicitly state 
that children should be a function in your propTypes when designing an API like this.
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};

*/

/*
Caveats
Be careful when using Render Props with React.PureComponent
Using a render prop can negate the advantage that comes from using React.PureComponent
 if you create the function inside a render method. This is because the shallow prop 
 comparison will always return false for new props, and each render in this case will 
 generate a new value for the render prop.
For example, continuing with our <Mouse> component from above, if Mouse were to extend
React.PureComponent instead of React.Component, our example would look like this:
class Mouse extends React.PureComponent {
  // Same implementation as above...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {
          //This is bad! The value of the `render` prop will
         // be different on each render.
        }
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
In this example, each time <MouseTracker> renders, it generates a new function as 
the value of the <Mouse render> prop, thus negating the effect of <Mouse> extending 
React.PureComponent in the first place!
To get around this problem, you can sometimes define the prop as an instance method, like so:
class MouseTracker extends React.Component {
  // Defined as an instance method, `this.renderTheCat` always
  // refers to *same* function when we use it in render
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
In cases where you cannot define the prop statically (e.g. because you need to close
 over the component’s props and/or state) <Mouse> should extend React.Component instead.

*/

