/*
Genel Kavram: useEffect Nedir?

React bileşenlerinde veri çekme (fetch), abonelik (subscription) gibi işlemleri yapman
 gerekir. Bunlara "yan etkiler" (side effects) denir. Çünkü bu işlemler:

Bileşenin dışında bir şeyi etkileyebilir (örneğin, başka bir API'den veri almak),
Ve bu işlemler render sırasında yapılamaz.
İşte bu tür işlemleri React'ta fonksiyon bileşenleri içinde yapabilmek için useEffect 
adında özel bir Hook kullanılır.

*/

/*
useEffect(() => { ... });

Her render'dan sonra çalışacak bir efekt tanımlıyoruz.
Buradaki örnekte: document.title = ... ile sayfa sekmesinin başlığını değiştiriyoruz.
Yani kullanıcı her tıkladığında sayfa başlığı güncelleniyor.

*/

/*
2. useEffect ile Abonelik (Subscribe/Unsubscribe) Örneği

🔸 Kod:
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

    //Bileşen ekrana geldiğinde (mount):
    //ChatAPI.subscribeToFriendStatus(...) ile arkadaşın durumunu dinlemeye başlar.
    //Bileşen kaldırıldığında (unmount) veya yeniden render olursa:
    //unsubscribeFromFriendStatus(...) ile dinlemeyi bırakır.



  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
*/

/*
 3. useEffect’leri Ayırmak (Birden Fazla useEffect Kullanımı)

🔸 Kod:
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  // ...
}
🔍 Neden 2 Tane useEffect Kullanıldı?
İlk useEffect:
Sadece sayfa başlığını günceller (count değiştiğinde).
İkinci useEffect:
ChatAPI üzerinden arkadaşın durumuna abone olur.
React'ta istediğin kadar useEffect kullanabilirsin. Her biri, ilgili işlevle sınırlı 
olur. Bu da kodu daha düzenli yapar.
*/

/*
useEffect şu durumlarda çalışır:
İlk render (sayfa ilk yüklendiğinde),
Her state veya prop değişikliğinde (eğer bağımlılık verilmemişse),
Ve önceki efektin temizlenmesi gerektiğinde.

*/

/*
useEffect'e Bağımlılık Eklemek (Optional but Useful)

Yukarıdaki örneklerde useEffect(() => { ... }) şeklinde bağımlılık verilmemişti. Ama verebiliriz:

useEffect(() => {
  // işlem
}, [count]);
Bu durumda:

count değişirse çalışır.
Değişmezse çalışmaz.
Yani ChatAPI örneğinde şunu yaparsak:

useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]);
Bu sayede:

Sadece props.friend.id değiştiğinde yeniden abone oluruz.
Gereksiz yere her render’da abonelik kurmaya gerek kalmaz.

*/

//npm i eslint-plugin-react-hooks

/*
1. useEffect içindeki bağımlılık dizisi YOKSA

useEffect(() => {
  // Kod
});
✅ Ne olur?
Bu durumda React, bu useEffect’i her render sonrası çalıştırır.
İlk render (sayfa yüklendiğinde)
Her state veya prop değişikliğinde yeniden render olursa → bu efekt tekrar çalışır.
🧠 Ne işe yarar?
Bu, en genel kullanımdır. Örneğin sayfa başlığını her count değiştiğinde 
güncellemek istiyorsan ama bağımlılık vermezsen, gereksiz yere her render sonrası bu efekt çalışır.

⚠️ Dezavantaj:
Gereksiz çalışır. Hedeflediğin değişken değişmemiş bile olsa, çalışır.


*/

/*
2. useEffect içindeki bağımlılık dizisi BOŞSA

useEffect(() => {
  // Kod
}, []);
✅ Ne olur?
Efekt sadece ilk render’da bir kez çalışır.
Sonraki render’larda hiç çalışmaz.
🧠 Ne işe yarar?
Bu kullanım componentDidMount gibi davranır. Örneğin:

API’den veri çekmek,
Bir kezlik abonelik kurmak (WebSocket gibi),
Sayfa başında scroll’u sıfırlamak gibi...
tek seferlik işlemler için idealdir.


*/

/*
3. useEffect içindeki bağımlılık dizisi belirli bir değer içeriyorsa

useEffect(() => {
  // Kod
}, [count]);
✅ Ne olur?
count değiştiğinde efekt çalışır.
count aynı kalırsa, diğer render’lar olsa bile çalışmaz.
🧠 Ne işe yarar?
Kontrollü çalıştırma sağlar.
Örneğin sadece kullanıcı butona basıp count arttığında çalışmasını istiyorsan bu ideal kullanım olur.

*/

/*
 useEffect İçindeki return: Cleanup Fonksiyonu

useEffect(() => {
  // Etki (effect)
  return () => {
    // Temizlik (cleanup)
  };
}, []);
🔍 Ne işe yarar?
Effect başladığında: useEffect'in ilk kısmı çalışır.
Effect bitirilmeden önce (örneğin bileşen kaldırıldığında veya bağımlılıklar
 değiştiğinde): return içindeki fonksiyon çalışır.
Yani bu yapı şu anlamdadır:

Bir şey başlat → setInterval, event listener, abonelik vs.
Sonra temizle → bellek sızıntısı (memory leak) olmasın diye.
⏱️ Ne zaman çalışır?

1. Bileşen sayfadan kaldırıldığında (unmount):
useEffect(() => {
  console.log("Bileşen eklendi");
  return () => {
    console.log("Bileşen kaldırılıyor (temizleme)");
  };
}, []);
2. Bağımlılık değiştiğinde:
useEffect(() => {
  console.log("Yeni bir kullanıcıya bağlanılıyor");
  return () => {
    console.log("Önceki kullanıcı bağlantısı kesiliyor");
  };
}, [userId]);
🔁 Örnek 1: setInterval + Temizleme

useEffect(() => {
  const timer = setInterval(() => {
    console.log("Her saniye");
  }, 1000);

  return () => {
    clearInterval(timer); // olmazsa arka planda çalışmaya devam eder
    console.log("Timer temizlendi");
  };
}, []);
✅ Neden önemli?
Eğer clearInterval yapılmazsa:

Kullanıcı başka sayfaya geçse bile setInterval çalışmaya devam 
eder → performans problemi, hata, memory leak.
📡 Örnek 2: Abonelik (Subscription)

useEffect(() => {
  ChatAPI.subscribeToFriendStatus(id, handleStatus);

  return () => {
    ChatAPI.unsubscribeFromFriendStatus(id, handleStatus);
  };
}, [id]);
✅ Ne oluyor?
id değiştiğinde → önceki unsubscribe edilir, sonra yeni subscribe edilir.
⚠️ return olmazsa ne olur?

useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []);
resize eventi eklendi ✅
Ama hiçbir zaman kaldırılmadı ❌
Kullanıcı başka sayfaya geçse bile olay dinleyicisi çalışmaya devam eder → bellek sızıntısı olur.
Bunu düzeltmek için:

useEffect(() => {
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);

*/

/*
custom hooks olusturdugumuz farkli yerlerde cagirdimizda icinde olusturdugumuz 
state ler ayri ayri olusuyor
Hook'lar Fonksiyondur

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  // ...
}
Bu fonksiyon her çağrıldığında (yani bileşende kullanıldığında), useState yepyeni bir state oluşturur.
Yani:

A bileşeni useFriendStatus çağırır → kendi isOnline state’ine sahip olur.
B bileşeni de çağırır → bu da kendi isOnline state’ine sahip olur.
Bu state’ler birbiriyle bağlantılı değildir, çünkü ayrı ayrı useState çalıştırılmıştır.

Hook'lar, state'li mantığı paylaşır; ama state'in kendisini paylaşmaz.
Yani:

Her useFriendStatus çağrısı kendi içindeki useState ile izole çalışır.
İki farklı bileşende aynı Hook’u kullansan bile, birbirinden bağımsız state’ler oluşur.

*/


/*
function 
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

Equivalent class
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}

*/


//classlarin icinde bu hookslari kullanamayiz onlarin icinde useeffect useffect yoktur
//classda this var onunla kontrol ediyoruz

//usestate
//Normalde, bir fonksiyonda tanımlanan değişkenler fonksiyon bittiğinde yok olur — 
// ama state değişkenleri React tarafından korunur.

/*
useState(), iki öğeden oluşan bir dizi (array) döner:

Mevcut state değeri
O değeri güncellemek için bir fonksiyon
Bu yüzden şöyle yazıyoruz:

const [count, setCount] = useState(0);
Bu yapı, sınıflarda kullanılan this.state.count ve this.setState() ile aynı mantıktadır,
ancak burada bu ikisini birlikte bir çift olarak alırız.
*/

/*
Ne zaman obje kullanmalı?
İki state birbiriyle bağlantılıysa, örneğin bir formda name, email, age gibi 
alanlar varsa: ✅ Obje kullanmak mantıklıdır.
Ama tamamen bağımsız iki state varsa: ✅ Ayrı ayrı useState() kullanmak daha okunur olur.

*/

//class
/*
class Example extends React.Component {
  constructor(props) {
    super(props);
    // Obje şeklinde state tanımlanır
    this.state = {
      count: 0,
      name: 'Serkan'
    };
  }

  // count artırma fonksiyonu
  increment = () => {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  };

  // name güncelleme fonksiyonu
  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

*/

//function 
/*
function Example() {
  // Obje şeklinde bir başlangıç state'i tanımlıyoruz
  const [formData, setFormData] = useState({
    count: 0,
    name: 'Serkan'
  });

  // count değerini artırmak için
  const increment = () => {
    setFormData(prevState => ({
      ...prevState,
      count: prevState.count + 1
    }));
  };

  // name değerini güncellemek için
  const handleNameChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      name: e.target.value
    }));
  };
*/


/*
This JavaScript syntax is called “array destructuring”. It means that we’re making 
two new variables fruit and setFruit, where fruit is set to the first value returned
 by useState, and setFruit is the second. It is equivalent to this code:
  var fruitStateVariable = useState('banana'); // Returns a pair
  var fruit = fruitStateVariable[0]; // First item in a pair
  var setFruit = fruitStateVariable[1]; // Second item in a pair
When we declare a state variable with useState, it returns a pair — an array with 
two items. The first item is the current value, and the second is a function that lets
 us update it. Using [0] and [1] to access them is a bit confusing because they have
  a specific meaning. This is why we use array destructuring instead.

Bu JavaScript sözdizimi “dizi parçalama (array destructuring)” olarak adlandırılır.fruit 
ve setFruit diye iki yeni değişken oluşturduğumuz anlamına gelir.Burada fruit, useState 
tarafından dönen ilk değere; setFruit ise ikinci değere atanır bu kod ile eşdeğerdir.
  var fruitStateVariable = useState('banana'); // Returns a pair
  var fruit = fruitStateVariable[0]; // First item in a pair
  var setFruit = fruitStateVariable[1]; // Second item in a pair
useState ile state değişkeni tanımladığımız zaman, bu bir çift (iki elemanlı bir dizi)
 döndürür. İlk eleman o anki değer, ikincisi ise onu güncelleyen fonksiyondur. [0] ve
  [1] kullanarak erişmek biraz kafa karıştırıcı çünkü onların kendine özgü anlamları var.
   Bu yüzden onun yerine dizi parçalama (array destructuring) yöntemini kullanıyoruz.

*/


/*
There are two common kinds of side effects in React components: those that 
don’t require cleanup, and those that do. Let’s look at this distinction in more detail.
Effects Without Cleanup
Sometimes, we want to run some additional code after React has updated the DOM.
 Network requests, manual DOM mutations, and logging are common examples of 
 effects that don’t require a cleanup. We say that because we can run them and 
 immediately forget about them. Let’s compare how classes and Hooks let us express such side effects.

*/

/*
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  // Bileşen DOM'a eklendiğinde sayfa başlığını güncelle

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
        // Bileşen güncellendiğinde (state değiştiğinde) sayfa başlığını güncelle

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
*/

/*
1. Render Metodu Yan Etki Yaratmamalı
React sınıf (class) bileşenlerinde, render() metodu yan etkiler (side effects)
 yaratmamalıdır. Çünkü render işlemi, bileşenin nasıl görüneceğini tanımlar ve
  çok erken bir aşamadır. Biz genellikle yan etkileri, DOM (sayfa içeriği)
   güncellendikten sonra yapmak isteriz.

2. Yan Etkiler componentDidMount ve componentDidUpdate İçinde Yapılır
React sınıf bileşenlerinde yan etkiler şu iki yaşam döngüsü (lifecycle) metodunda yapılır:

componentDidMount: Bileşen ilk defa DOM’a eklendiğinde çağrılır.
componentDidUpdate: Bileşen güncellendikten sonra çağrılır.
Yani, DOM tamamen güncellendikten sonra yan etkiler burada gerçekleştirilir.


*/

/*
 Kodun İki Metotta Tekrarlanması
Burada dikkat edilmesi gereken bir nokta var:
document.title'i güncelleyen aynı kodu hem componentDidMount içinde hem de componentDidUpdate
 içinde tekrarlamak zorundayız.

Çünkü:

Bazen bileşen ilk defa yüklendiğinde (mount) bu işlemi yapmak istiyoruz.
Bazen bileşen güncellendiğinde (state veya props değiştiğinde) aynı işlemi yapmak istiyoruz.
5. React Class Bileşenlerinde Bu Tekrarlama Sorunu
React class bileşenlerinde render’dan sonra her zaman çağrılan tek bir metot yok 
(örneğin useEffect gibi).
Bu yüzden aynı işlemi hem mount hem update aşamalarında ayrı ayrı yapmak gerekiyor.
Elbette, bu tekrarı azaltmak için işlemi ayrı bir metoda yazıp, hem componentDidMount
 hem de componentDidUpdate içinde bu metodu çağırabiliriz. Ancak gene de iki yerde 
 çağrı yapmak zorundayız.
Özet:
Class bileşenlerinde yan etkiler render içinde değil, yaşam döngüsü metotlarında yapılır.
Mount ve update işlemlerinde aynı yan etkiyi yapmamız gerektiği için kodun tekrarlanması gerekir.
React fonksiyon bileşenleri ve useEffect Hook’u, bu tekrarı ortadan kaldırır ve yan 
etkilerin yönetimini kolaylaştırır.
*/


/*
Example Using Hooks
We’ve already seen this example at the top of this page, but let’s take a closer look at it:
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
What does useEffect do? By using this Hook, you tell React that your 
component needs to do something after render. React will remember the 
function you passed (we’ll refer to it as our “effect”), and call it later 
after performing the DOM updates. In this effect, we set the document title, 
but we could also perform data fetching or call some other imperative API.
Why is useEffect called inside a component? Placing useEffect inside the 
component lets us access the count state variable (or any props) right from 
the effect. We don’t need a special API to read it — it’s already in the
 function scope. Hooks embrace JavaScript closures and avoid introducing 
 React-specific APIs where JavaScript already provides a solution.
Does useEffect run after every render? Yes! By default, it runs both after 
the first render and after every update. (We will later talk about how to 
customize this.) Instead of thinking in terms of “mounting” and “updating”, 
you might find it easier to think that effects happen “after render”. React 
guarantees the DOM has been updated by the time it runs the effects.

*/

/*
Unlike componentDidMount or componentDidUpdate, effects scheduled with 
useEffect don’t block the browser from updating the screen. This makes 
your app feel more responsive. The majority of effects don’t need to happen
 synchronously. In the uncommon cases where they do (such as measuring the 
 layout), there is a separate useLayoutEffect Hook with an API identical to useEffect.

 componentDidMount veya componentDidUpdate ten farklı olarak, useEffect 
 ile planlanan etkiler tarayıcının ekranı güncellemesini engellemez. Bu, 
 uygulamanızı daha duyarlı hale getirir. Etkilerin çoğunun eşzamanlı olarak 
 gerçekleşmesi gerekmez. Yaptıkları nadir durumlarda (düzeni belirlemek gibi),
  useLayoutEffect adında useEffect ile aynı yapıda bir Hook vardır.
*/



//Example Using Classes
/*
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
Notice how componentDidMount and componentWillUnmount need to mirror 
each other. Lifecycle methods force us to split this logic even though
 conceptually code in both of them is related to the same effect.
*/

/*
Example Using Hooks
Let’s see how we could write this component with Hooks.
You might be thinking that we’d need a separate effect to perform the cleanup. But code for adding and removing a subscription is so tightly related that useEffect is designed to keep it together. If your effect returns a function, React will run it when it is time to clean up:
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
Why did we return a function from our effect? This is the optional cleanup 
mechanism for effects. Every effect may return a function that cleans up after 
it. This lets us keep the logic for adding and removing subscriptions close to
 each other. They’re part of the same effect!
When exactly does React clean up an effect? React performs the cleanup when
 the component unmounts. However, as we learned earlier, effects run for every 
 render and not just once. This is why React also cleans up effects from the 
 previous render before running the effects next time. We’ll discuss why this 
 helps avoid bugs and how to opt out of this behavior in case it creates 
 performance issues later below.
Note
We don’t have to return a named function from the effect. We called it cleanup 
here to clarify its purpose, but you could return an arrow function or call 
it something different.

Neden etkimizden bir işlevi döndürdük? Bu, etkiler için isteğe bağlı 
temizleme mekanizmasıdır. Her etki, arkasından temizleyen bir işlev 
döndürebilir. Bu, abonelik ekleme ve kaldırma mantığını birbirine yakın 
tutmamızı sağlar. Aynı etkinin parçalarıdırlar!
React bir efekti tam olarak ne zaman temizler? React temizleme işlemini 
bileşen ayrıldığında gerçekleştirir. Ancak, daha önce öğrendiğimiz gibi, 
etkiler yalnızca bir kez değil, her render da çalışır. Bu nedenle React 
ayrıca, etkileri bir sonraki sefer çalıştırmadan önce önceki işlemdeki etkileri 
temizler. Bunun neden hatalardan kaçınmaya yardımcı olduğunu ve performans 
sorunları yaratması durumunda bu davranışın nasıl devre dışı bırakılacağından
 aşağıda daha sonra bahsedeceğiz.
Not
Etkilerden adlandırılmış bir fonksiyon dönmek zorunda değiliz. Buraada amacını
 belli etmesi açısından temizleme(cleanup) olarak adlandırdık fakat arrow 
 fonksiyon döndürülebilir veya başka bir fonksiyon şeklinde çağırabilir.

*/

/*
useEffect in bir bileşen oluşturulduktan sonra farklı yan etkileri ifade 
etmemize izin verdiğini öğrendik. Bazı efektler temizleme gerektirebilmektedir,
 bu nedenle bir fonksiyon döndürürler:
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
Diğer etkilerin temizleme aşaması olmayabilir ve hiçbir şey döndürmeyebilirler.
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
Etki Hook’u, her iki kullanım durumunu da tek bir API altında birleştirir.
*/


/*
Tip: Use Multiple Effects to Separate Concerns
One of the problems we outlined in the Motivation for Hooks is that class lifecycle methods often contain unrelated logic, but related logic gets broken up into several methods. Here is a component that combines the counter and the friend status indicator logic from the previous examples:
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
Note how the logic that sets document.title is split between componentDidMount
 and componentDidUpdate. The subscription logic is also spread between 
 componentDidMount and componentWillUnmount. And componentDidMount contains code for both tasks.
So, how can Hooks solve this problem? Just like you can use the State Hook 
more than once, you can also use several effects. This lets us separate 
unrelated logic into different effects:
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
Hooks let us split the code based on what it is doing rather than a
 lifecycle method name. React will apply every effect used by the component,
  in the order they were specified.
Yaşam döngüsü methodları yerine Hook’lar, kodu yaptığı işe göre bölmemize 
izin verir. React, bileşen tarafından kullanılan her etkiyi, belirtilen sırayla uygulayacaktır.


*/

/*
Explanation: Why Effects Run on Each Update
If you’re used to classes, you might be wondering why the effect cleanup phase
 happens after every re-render, and not just once during unmounting. Let’s look 
 at a practical example to see why this design helps us create components with fewer bugs.
Earlier on this page, we introduced an example FriendStatus component that displays 
whether a friend is online or not. Our class reads friend.id from this.props, 
subscribes to the friend status after the component mounts, and unsubscribes during unmounting:
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
But what happens if the friend prop changes while the component is on the screen? 
Our component would continue displaying the online status of a different friend.
 This is a bug. We would also cause a memory leak or crash when unmounting since 
 the unsubscribe call would use the wrong friend ID.
In a class component, we would need to add componentDidUpdate to handle this case:
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // Unsubscribe from the previous friend.id
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // Subscribe to the next friend.id
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
Forgetting to handle componentDidUpdate properly is a common source of bugs in React applications.
Now consider the version of this component that uses Hooks:
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
It doesn’t suffer from this bug. (But we also didn’t make any changes to it.)
There is no special code for handling updates because useEffect handles them by
 default. It cleans up the previous effects before applying the next effects. To
  illustrate this, here is a sequence of subscribe and unsubscribe calls that this
   component could produce over time:
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect

// Update with { friend: { id: 300 } } props
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // Run next effect

// Unmount
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // Clean up last effect
This behavior ensures consistency by default and prevents bugs that are common in 
class components due to missing update logic.

*/

/*
Tip: Optimizing Performance by Skipping Effects
In some cases, cleaning up or applying the effect after every render might create a performance problem. In class components, we can solve this by writing an extra comparison with prevProps or prevState inside componentDidUpdate:
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
This requirement is common enough that it is built into the useEffect Hook API. You can tell React to skip applying an effect if certain values haven’t changed between re-renders. To do so, pass an array as an optional second argument to useEffect:
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
In the example above, we pass [count] as the second argument. What does this mean? If the count is 5, and then our component re-renders with count still equal to 5, React will compare [5] from the previous render and [5] from the next render. Because all items in the array are the same (5 === 5), React would skip the effect. That’s our optimization.
When we render with count updated to 6, React will compare the items in the [5] array from the previous render to items in the [6] array from the next render. This time, React will re-apply the effect because 5 !== 6. If there are multiple items in the array, React will re-run the effect even if just one of them is different.
This also works for effects that have a cleanup phase:
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // Only re-subscribe if props.friend.id changes
In the future, the second argument might get added automatically by a build-time transformation.
Note
If you use this optimization, make sure the array includes all values from 
the component scope (such as props and state) that change over time and that
 are used by the effect. Otherwise, your code will reference stale values from 
 previous renders. Learn more about how to deal with functions and what to do 
 when the array changes too often.
If you want to run an effect and clean it up only once (on mount and unmount),
 you can pass an empty array ([]) as a second argument. This tells React that 
 your effect doesn’t depend on any values from props or state, so it never
  needs to re-run. This isn’t handled as a special case — it follows directly 
  from how the dependencies array always works.
If you pass an empty array ([]), the props and state inside the effect will 
always have their initial values. While passing [] as the second argument is 
closer to the familiar componentDidMount and componentWillUnmount mental model, 
there are usually better solutions to avoid re-running effects too often. Also, 
don’t forget that React defers running useEffect until after the browser has 
painted, so doing extra work is less of a problem.

*/

/*
Only Call Hooks at the Top Level
Don’t call Hooks inside loops, conditions, or nested functions. Instead, 
always use Hooks at the top level of your React function, before any early 
returns. By following this rule, you ensure that Hooks are called in the same
 order each time a component renders. That’s what allows React to correctly 
 preserve the state of Hooks between multiple useState and useEffect calls. 
 (If you’re curious, we’ll explain this in depth below.)
Only Call Hooks from React Functions
Don’t call Hooks from regular JavaScript functions. Instead, you can:
✅ Call Hooks from React function components.
✅ Call Hooks from custom Hooks (we’ll learn about them on the next page).

*/

/*
function Form() {
  // 1. Use the name state variable
  const [name, setName] = useState('Mary');

  // 2. Use an effect for persisting the form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Use the surname state variable
  const [surname, setSurname] = useState('Poppins');

  // 4. Use an effect for updating the title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
So how does React know which state corresponds to which useState call? The
 answer is that React relies on the order in which Hooks are called. Our
  example works because the order of the Hook calls is the same on every render:
// ------------
// First render
// ------------
useState('Mary')           // 1. Initialize the name state variable with 'Mary'
useEffect(persistForm)     // 2. Add an effect for persisting the form
useState('Poppins')        // 3. Initialize the surname state variable with 'Poppins'
useEffect(updateTitle)     // 4. Add an effect for updating the title

// -------------
// Second render
// -------------
useState('Mary')           // 1. Read the name state variable (argument is ignored)
useEffect(persistForm)     // 2. Replace the effect for persisting the form
useState('Poppins')        // 3. Read the surname state variable (argument is ignored)
useEffect(updateTitle)     // 4. Replace the effect for updating the title

// ...
As long as the order of the Hook calls is the same between renders, React can associate some local state with each of them. But what happens if we put a Hook call (for example, the persistForm effect) inside a condition?
  // 🔴 We're breaking the first rule by using a Hook in a condition
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
The name !== '' condition is true on the first render, so we run this Hook. 
However, on the next render the user might clear the form, making the
 condition false. Now that we skip this Hook during rendering, the order of 
 the Hook calls becomes different:
useState('Mary')           // 1. Read the name state variable (argument is ignored)
// useEffect(persistForm)  // 🔴 This Hook was skipped!
useState('Poppins')        // 🔴 2 (but was 3). Fail to read the surname state variable
useEffect(updateTitle)     // 🔴 3 (but was 4). Fail to replace the effect
React wouldn’t know what to return for the second useState Hook call. React
 expected that the second Hook call in this component corresponds to the 
 persistForm effect, just like during the previous render, but it doesn’t 
 anymore. From that point, every next Hook call after the one we skipped 
 would also shift by one, leading to bugs.
This is why Hooks must be called on the top level of our components. If we 
want to run an effect conditionally, we can put that condition inside our Hook:
  useEffect(function persistForm() {
    // 👍 We're not breaking the first rule anymore
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });

*/

