import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './components/app';
import ErrorBoundry from './components/error-boundry';
import BookstoreService from './services/bookstore-service';
import { BookstoreServiceProvider } from './components/bookstore-service-context';

import store from './store';

const bookstoreService = new BookstoreService();

ReactDOM.render(
    <Provider store={store}>
        <ErrorBoundry>
            <BookstoreServiceProvider value={bookstoreService}>
                <Router>
                    <App />
                </Router>
            </BookstoreServiceProvider>
        </ErrorBoundry>
    </Provider>,
    document.getElementById('root')
);

/*121 Вспомогательные компоненты
Большинству приложений необходимы вспомогательные компоненты:
- ErrorBoundry
- контекст (или несколько контекстов)
- НОС для работы с контекстом (withXyzService)
Эти и другие вспомогательные компоненты лучше создать сразу (до начала работы над основным функционалом приложения)
 */

/*122 Redux компоненты
Для того, чтобы создать Redux приложение нужно определить функцию-reducer.
Функции action-creator'ы не обязательно использовать, но на практике они присутствуют всегда.
Логику создания store удобно вынести в отдельный файл (код инициализации store станет немного сложнее в будущем).
*/

/*123 Каркасc React-Redux приложения
//Предоставляет доступ к Redux Store
<Provider store={store}>
    //Обработка ошибок в компонентах ниже
    <ErrorBoundry>
        //Передает сервис через ContextAPI
        <ServiceProvider value={service}>
            //Router из пакета react-router
            <Router>
                //Само приложение
                <App />
*/

/*124 Роутинг
Вспомним как работает роутинг в React
//отрисовываем максимум один Route
<Switch>
  //Route - конфигурируем адрес "/"
  <Route path="/" component={Home} exact />

  //Route - конфигурирует адрес "/cart"
  <Route path="/cart" component={Cart} />
</Switch>
*/

/*125 Чтение данных из Redux Store
const Person = ({name}) => {
  return <p>{name}</p>;
//Эта функция определяет, какие свойства получить компонент из Redux
const mapStateToProps = (state) => {
  return { name: state.firstName };
}

export default connect(mapStateToProps)(Person);
*/

/*126 Отправка действий в Redux Store (action dispatch)
Чтобы получить данные из сервиса и передать их в Redux Store мы использовали два НОС.
Первый НОС - withBookstoreService, получает сервис из контекста и передает в компонент.
Второй НОС - connect() - оборачивает функцию dispatch из Redux Store.
mapDispatchToProps может быть функцией или объектом. Если это объект, то он передается в bindActionCreators().

Старый код:
раньше
const mapDispatchToProps = (dispatch) => { //принимает dispatch
  return { //возвращает объект, где ключи это свойства, которые мы будем присваивать нашему компоненту, а значение это функция, которую мы будем вызывать
    booksLoaded: (newBooks) => { //в качестве свойства функция, которая принимает newBooks и dispatch-ит действие с типом 'BOOKS_LOADED' и payload: newBooks
      dispatch(booksLoaded(newBooks)); //создаем эту функцию при помощи action creator-a
    }
  };
};

позже
const mapDispatchToProps = (dispatch) => { //принимает dispatch
  return bindActionCreators({//возвращаем bindActionCreators, в качестве первого аргумента мы передаем объект с actionCreator-ами, которые нам будут нужны в этом компоненте, в качестве второго аргумента передаем - dispatch
    booksLoaded
  }, dispatch); //bindActionCreators обернет наши AC и сделает так, что как только мы вызываем функцию booksLoaded, она автоматически будет созавать нужное действие и передавать его в метод dispatch, чтобы не писать этот код вручную
};
 */

/*127 Стили (опциональное видео)
В react-redux приложении стили работают точно так же, как в обычном React приложении.
Сайты, которые мы использовали:
https://bootstrapcdn.com
https://fonts.google.com
 */

/*128 Работа с асинхронными данными
Реализовать загрузку данных в Redux можно так-же, как и в обычном React приложении:
Добавить поле loading в Redux state.
Обновлять это поле в reduсer, когда данные становятся доступны.
Передать значение loading в компонент, используя mapStateToProps
 */

/*129 Отличия setState() и reducer
В setState() можно передавать только ту часть state, которую нужно обновить
setState({ updatedProp: 'new value' });
Reducer должен вернуть полный объект state
return {
  ...state,
  updatedProp: newValue
}
 */

/*130 Обработка ошибок
Ошибку получения данных нужно сохранить в store. ЗАтем компонент сможет ее отобразить.
Чтобы сохранить ошибку, нужно создать отдельное действие (BOOK_FETCH_ERROR).
Саму ошибку можно передать вместе с действием и сохранить в store.
 */

/*131 mapDispatchToProps аргумент ownProps
У mapDispatchToProps есть второй аргумент
<Person details="full" />

mapDispatchToProps = (dispatch, ownProps) => {
  console.log(ownProps.details); //full
}

export default connect(......)(Person)
//
Провели рефатокторинг, вынесли всю логику получения и обработки данных из componentDidMount в отдельную функцию fetchBooks, которую мы создали внутри mapDispatchToProps.
Мы изменили mapDispatchToProps, до этого это был объект, а теперь мы сделали из него функцию. Это позволило нам получить прямой доступ к методу dispatch и кроме того к свойству ownProps (это свойство нашего компонента, которое он получил сверху от других компонентов).
В нашем случае компонент, который находится сверху - это withBookstoreService. Другими словами в ownProps мы получим наш bookstoreService из контекста. И после этого внутри функции fetchBooks мы сможем использовать этот сервис.

старый код
componentDidMount() { //внутри этого метода нам нужно: 1) получить данные. 2)dispatch action to store (передать действие в store)
    const {
      bookstoreService, //получаем наш сервис из свойств (контекста)
      booksLoaded, //деструктурируем booksLoaded из props
      booksRequested, // get booksRequested from props
      booksError } = this.props; //получаем booksError из props

    booksRequested(); //перед тем как мы отправим запрос на получение новых книг, мы вызываем АС booksRequested и соответственно установим значение loading в true и после этого мы будем отображать спиннер, до тех пор пока мы не получим данные. Теперь каждый раз когда мы будем переходить на этот компонент и этот компонент bookList будет запрашивать обновление данных - пользователь будет видеть спиннер
    bookstoreService.getBooks() //получаем данные с помощью getBooks
      .then((data) => booksLoaded(data)) //передаем данные в this.props.booksLoaded(data) //когда получим данные, мы можем вызвать this.props.booksLoaded(data)//после получения данных вызываем функцию booksLoaded //это экшн-криэтор который вызывает dispatch и передает данные (список книг) в redux store
      .catch((err) => booksError(err)); //помещаем в блок catch нашего промиса, то есть, если что-то пошло не так, мы получем ошибку и сразу вызываем booksError и передаем туда объект с ошибкой err
  }
//
const mapDispatchToProps = {//вместо того чтобы передавать функцию (я перенес ее в index 126 как _позже_) в качестве второго аргумента в коннект, мы можем передать объект, если мы вместо функции передаем объект, то этот объект попадет в качестве 1-го аргумента в bindActionCreators
  booksLoaded, //поэтому просто передаем объект booksLoaded, наш АС// все остальное редакс сделает за нас - обернет booksLoaded в bindActionCreators и сделает так, что как только наш компонент будет вызывать эту функцию booksLoaded будет не только создаваться новое действие, но оно сразу будет передаваться в dispatch и сразу же попадать в store
  booksRequested,
  booksError //передаем АС booksError в компонент через mapDispatchToProps
};
новый код
componentDidMount() {
    this.props.fetchBooks(); //передаем сюда функцию fetchBooks//вызывая эту функцию, наш компонент запускает логику получения данных, а затем единственное за что отвечает - за рендеринг
  }
//
const mapDispatchToProps = (dispatch, ownProps) => { //функциональная форма. принимает метод dispatch и эта функция возврщает объект //ownProps это те свойства, которые перешли компоненту, который создает коннект (connect(mapStateToProps, mapDispatchToProps). Таким образом мы получим сервис (bookstoreService)
  const { bookstoreService } = ownProps; //получаем сервис из ownProps, теперь мы можем его использовать в функции fetchBooks
  return { //объект имеет точно такую же структуру как у mapStateToProps (в качестве ключей мы передаем названия свойств, которые получит наш компонент)
    fetchBooks: () => { //передаем функцию fetchBooks, а в качестве значений может быть не только АС, но вообще любая функция, которая делает все что угодно
      dispatch(booksRequested()); //перед тем как мы отправим запрос на получение новых книг, мы вызываем АС booksRequested и соответственно установим значение loading в true и после этого мы будем отображать спиннер, до тех пор пока мы не получим данные. Теперь каждый раз когда мы будем переходить на этот компонент и этот компонент bookList будет запрашивать обновление данных - пользователь будет видеть спиннер
      bookstoreService.getBooks() //получаем данные с помощью getBooks
        .then((data) => dispatch(booksLoaded(data))) //передаем данные в this.props.booksLoaded(data) //когда получим данные, мы можем вызвать this.props.booksLoaded(data)//после получения данных вызываем функцию booksLoaded //это экшн-криэтор который вызывает dispatch и передает данные (список книг) в redux store
        .catch((err) => dispatch(booksError(err))); //помещаем в блок catch нашего промиса, то есть, если что-то пошло не так, мы получем ошибку и сразу вызываем booksError и передаем туда объект с ошибкой err
    }
  }
};
 */

/*132 Naming Convention для действий
[тип запроса]_[объект]_[действие]
FETCH_BOOKS_REQUEST - запрос отправлен
FETCH_BOOKS_SUCCESS - получен результат (в payload передаются полученные данные)
FETCH_BOOKS_FAILURE - произошла ошибка (в payload передается объект Error)

старый код
const mapDispatchToProps = (dispatch, ownProps) => { //функциональная форма. принимает метод dispatch и эта функция возврщает объект //ownProps это те свойства, которые перешли компоненту, который создает коннект (connect(mapStateToProps, mapDispatchToProps). Таким образом мы получим сервис (bookstoreService)
  const { bookstoreService } = ownProps; //получаем сервис из ownProps, теперь мы можем его использовать в функции fetchBooks
  return { //объект имеет точно такую же структуру как у mapStateToProps (в качестве ключей мы передаем названия свойств, которые получит наш компонент)
    fetchBooks: () => { //передаем функцию fetchBooks, а в качестве значений может быть не только АС, но вообще любая функция, которая делает все что угодно
      dispatch(booksRequested()); //перед тем как мы отправим запрос на получение новых книг, мы вызываем АС booksRequested и соответственно установим значение loading в true и после этого мы будем отображать спиннер, до тех пор пока мы не получим данные. Теперь каждый раз когда мы будем переходить на этот компонент и этот компонент bookList будет запрашивать обновление данных - пользователь будет видеть спиннер
      bookstoreService.getBooks() //получаем данные с помощью getBooks
        .then((data) => dispatch(booksLoaded(data))) //передаем данные в this.props.booksLoaded(data) //когда получим данные, мы можем вызвать this.props.booksLoaded(data)//после получения данных вызываем функцию booksLoaded //это экшн-криэтор который вызывает dispatch и передает данные (список книг) в redux store
        .catch((err) => dispatch(booksError(err))); //помещаем в блок catch нашего промиса, то есть, если что-то пошло не так, мы получем ошибку и сразу вызываем booksError и передаем туда объект с ошибкой err
    }
  }
};
перенесли fetchBooks в actions/index.js
const fetchBooks = (bookstoreService, dispatch) => () => { //передаем функцию fetchBooks, а в качестве значений может быть не только АС, но вообще любая функция, которая делает все что угодно //перенесли в actions/index.js чтобы функция работала передаем сюда bookstoreService и dispatch
  dispatch(booksRequested()); //перед тем как мы отправим запрос на получение новых книг, мы вызываем АС booksRequested и соответственно установим значение loading в true и после этого мы будем отображать спиннер, до тех пор пока мы не получим данные. Теперь каждый раз когда мы будем переходить на этот компонент и этот компонент bookList будет запрашивать обновление данных - пользователь будет видеть спиннер
  bookstoreService.getBooks() //получаем данные с помощью getBooks
    .then((data) => dispatch(booksLoaded(data))) //передаем данные в this.props.booksLoaded(data) //когда получим данные, мы можем вызвать this.props.booksLoaded(data)//после получения данных вызываем функцию booksLoaded //это экшн-криэтор который вызывает dispatch и передает данные (список книг) в redux store
    .catch((err) => dispatch(booksError(err))); //помещаем в блок catch нашего промиса, то есть, если что-то пошло не так, мы получем ошибку и сразу вызываем booksError и передаем туда объект с ошибкой err
};
//теперь функция fetchBooks - константа, которая будет являться функцией, которая должна возврщать функцию обернутую в "{}" - это тело функции, которые мы хотим вернуть. Для того чтобы эта функция работала нам нужны аргументы dispatch и bookstoreService, поэтому мы оборачиваем функцию в другую функцию и передадим сюда bookstoreService и dispatch. Мы не можем передать их во вторую функцию в (), потому что мы не хотим чтобы наш компонент, который будет вызывать функцию начинающуюся с 1-й "=>" напрямую зависел от этих параметров. Наш компонент должен просто вызвать функцию fetchBooks без каких-либо аргументов и запустить процесс получения книг, а остальные параметры (bookstoreService и dispatch) не должны касаться работы нашего компонента. Именно поэтому fetchBooks будет функцией, которая возвращает функцию. Внутренняя функция предназначена для компонента, внешняя для работы в mapDispatchToProps.
 */

/*133 Компоненты-контейнеры
Презентационные компоненты - отвечают только за рендеринг.
Компоненты-контейнеры - работают с Redux, реализуют loading, error и другую логику.
Компоненты-контейнеры иногда выносят в отдельные файлы (PersonContainer) или папки (/containers)

BookListContainer - оборачивает компонент BookList, который занимается только отображением и задача контейнера это связь нашего основного компонента с Redux Store, ну и кроме того реализация логики получения данных, отображения loading индикатора, error индикаторов и любых других состояний, которые не связаны напрямую с отображением самого списка. А сам список уже отображается уже компонентом BookList
 */

/*134 Подключение нового компонента к Redux
Начните с создания нового презентационного компонента. Он не должен "знать" о Redux.
Обновите state. Добавьте туда новые поля.
Для начала заполните state тестовыми данными.
Реализуйте функции для connect() и подключите компонент к Redux.

начинаем с того что пишем полноценную реакт реализацию компонента, которая ничего не знает про redux, а затем когда компонент готов мы обновляем redux store, добавляем новые поля и если нужно обновляем существующие действия, так чтобы наш store не сломать. Когда Redux Store готов, нужно вернуться в компонент и реализовать функции mapStateToProps, mapDispatchToProps и подключить компонент к Redux. После этого мы можем проверить что данные действительно отображаются корректно. Следующим этапом будет добавление действий в наш компонент
 */

/*135 Redux добавление элементов в массив
В redux приложениях, так же как и в React нельзя модифицировать state.
Добавить элемент в массив можно так:
case ADD_TO_ARRAY:
  const item = action.payload;
  return {
    items: [ ...state.items, item ]
  };


case 'BOOK_ADDED_TO_CART':
      const bookId = action.payload; //получаем id книги из action.payload
      const book = state.books.find((book) => book.id === bookId); //ищем в коллекции книг информацию о книге по id
      const itemIndex = state.cartItems.findIndex(({id}) => id === bookId); //ищем индекс элемента, у которого айди точно такой же как айди книги с которой мы сейчас работаем, в массиве. И этот айтем индекс элемента может быть либо индекс элемента либо -1, если такого элемента не существует. нам нужен этот индекс чтобы знать какой элемент обновлять
      const item = state.cartItems[itemIndex]; //если индекс -1, то есть элемента не существует, это выражение даст нам item = undefined, ошибки не будет

      let newItem;

      if (item) { //если у нас есть старый айтем, то мы создаем новый айтем на основании старого, то есть мы будем увеличивать count и цену
        newItem = {
          ...item, //берем все из item
          count: item.count + 1, //увеличиваем на 1 старое значение count
          total: item.total + book.price //общая цена + цена книги
        };
      } else { //если его нет, то тогда новый айтем будет создаваться
        newItem = {
          id: book.id,
          title: book.title,
          count: 1,
          total: book.price
        };
      }

      if (itemIndex < 0) { //если itemIndex меньше 0, то есть -1, то мы добавляем наш элемент в конец массива
        return { //возвращаем новый стейт, у которого будут все те же элементы, что и у старого стейта, кроме элемента cartItems, который будет новым массивом у которого будут все те же элементы cartItems плюс новый элемент newItem
          ...state,
          cartItems: [
            ...state.cartItems,
            newItem
          ]
        };
      } else { //в противоположном случае, если у нас уже есть индекс, и уже существующий элемент
        return { //возвращаем новый стейт, у которого будут все те же элементы, что и у старого стейта, кроме элемента cartItems, который будет новым массивом у которого будут все те же элементы cartItems плюс новый элемент newItem
          ...state,
          cartItems: [
            ...state.cartItems.slice(0, itemIndex), //берем элементы от 0 до индекса
            newItem, //затем вставляем новый элемент
            ...state.cartItems.slice(itemIndex + 1) //затем все элементы что идут после индекса. от индекс + 1 до конца массива
          ]
        };
      }
 */

/*136 Redux обновление элементов в массиве
Обновить элемент в массиве можно так:
case UPDATE_IN_ARRAY:
  const { item, index } = action.payload;
  return {
    items: [
      ...state.items.slice(0, index),
      item,
      ...state.items.slice(index + 1)
    ]
  };
 */

/*137 Redux удаление элементов из массива
Удалить элемент из массива можно так:
case DELETE_FROM_ARRAY:
  const { index } = action.payload;
  return {
    items: [
      ...state.items.slice(0, index),
      ...state.items.slice(index + 1)
    ]
  };

старый код обновления
case 'BOOK_ADDED_TO_CART':
      const bookId = action.payload; //получаем id книги из action.payload
      const book = state.books.find((book) => book.id === bookId); //ищем в коллекции книг информацию о книге по id
      const itemIndex = state.cartItems.findIndex(({id}) => id === bookId); //ищем индекс элемента, у которого айди точно такой же как айди книги с которой мы сейчас работаем, в массиве. И этот айтем индекс элемента может быть либо индекс элемента либо -1, если такого элемента не существует. нам нужен этот индекс чтобы знать какой элемент обновлять
      const item = state.cartItems[itemIndex]; //если индекс -1, то есть элемента не существует, это выражение даст нам item = undefined, ошибки не будет

      const newItem = updateCartItem(book, item);
      return { //возвращаем новый стейт, у которого будут все те же элементы, что и у старого стейта, кроме элемента cartItems, который будет новым массивом у которого будут все те же элементы cartItems плюс новый элемент newItem
        ...state,
        cartItems: updateCartItems(state.cartItems, newItem, itemIndex) //cartItems это updateCartItems
      };
 */

/*138 Организация кода reducer'а
Как только reducer становится сложным - сразу упрощайте его.
Работайте со структурой глобального state: объединяйте свойства в объекты.
Выносите логику обновления объектов из глобального state в отдельные функции.

старый код редюсера
const reducer = (state = initialState, action) => { //reducer это функция которая принимает 2 аргумента: state с которым мы сейчас работаем и action которое мы пытаемся выполнить //если state undefined он будет иметь значение initialState

  switch (action.type) {
    case 'FETCH_BOOKS_REQUEST':
    case 'FETCH_BOOKS_SUCCESS':
    case 'FETCH_BOOKS_FAILURE':
      return {
        ...state,
        bookList: updateBookList(state, action)
      };

    case 'BOOK_ADDED_TO_CART':
    case 'BOOK_REMOVED_FROM_CART':
    case 'ALL_BOOKS_REMOVED_FROM_CART':
      return {
        ...state,
        shoppingCart: updateShoppingCart(state, action)
      };

    default:
      return state;
  }
};
 */

/*139 Store Enhancers
Store Enhancer управляет процессом создания store. Возвращает новую реализацию createStore;
const logAll = (createStore) => (...args) => {
  const store = createStore(...args);
  const { dispatch } = store;
  store.dispatch = (action) => { //"подменяем" dispatch
    console.log(action);
    dispatch(action); //вызываем оригинальный dispatch
  }
  return store;
}
const store = createStore(reducer, logAll);
 */

/*140 Middleware
Middleware функции, которые последовательно вызываются при обработке действий:
 const logAll = (store) => (next) => (action) => {
  console.log(action.type);
  return next(action);
 }
 const store = createStore(reducer, applyMiddleware(logAll));
Middleware используются намного чаще, чем Store Enhancer.

import { createStore, applyMiddleware } from 'redux';

import reducer from './reducers';

const logMiddleware = ({ getState }) => (next) => (action) => { //принимает dispatch и возвращает новую версию dispatch
  console.log(action.type, getState());
  return next(action);
};

const stringMiddleware = () => (next) => (action) => {
  if (typeof action === 'string') { //теперь dispatch будет уметь принимать еще и строки
    return next({
      type: action
    });
  }

  return next(action);
};

const store = createStore(reducer, applyMiddleware(
  stringMiddleware, logMiddleware)); //создаем store//applyMiddleware передается в качестве последнего аргумента

store.dispatch('HELLO_WORLD');

export default store;
//сперва мы вызываем store.dispatch и передаем туда действие, это действие пока еще не попадает в reducer. Вместо этого действие перехватывается функцией applyMiddleware.
//applyMiddleware будет последовательно вызывать каждую функцию Middleware, сначала вызовется stringMiddleware. В качестве действия (action) мы получим обычную строку и логика нашего действия Middleware скажет что если это строка, то мы вызываем dispatch с заданным объектом ({type: action});
//В действительности эта функция dispatch которую мы здесь получаем (13 строка) это еще не настоящий dispatch самого store, это ссылка на следующий Middleware, который идет по порядку в нашей цепочке - logMiddleware (то есть dispatch с 11 вызвет функцию action с 6 строки).
//И эта функция получит наше событие со стр. 14. Наш logMiddleware получит действие (action), мы напечатаем тип этого действия в консоли (стр. 7), а затем снова вызовем dispatch (стр 8) и поскольку logMiddleware уже последний в цепочке, функция dispatch(action) со стр. 8 это уже настоящий dispatch, который передаст наше действие в reducer.
//Наши функции Middleware вызываются как-бы по цепочке и когда наша функция закончила делать то что она делает, она должна передать управление следующей функции в цепочке, именно поэтому аргумент (dispatch) называется словом next. По сути это следующий dispatch следующего Middleware в цепочке.

//Первый аргумент, который мы получаем на стр 6, (store), это по сути не весь store, а только 2 функции из store. Мы не получаем полный доступ к store когда мы работаем с Middleware, все что мы получаем это 2 функции: getState и dispatch. В нашем примере dispatch мы не используем, остается только getState.

//Middleware это функция которая модифицирует то, как работает функция dispatch. У нас может быть несколько Middleware, и если их несколько то они будут вызываться по цепочке, один за другим. Middleware имеют доступ к некоторым функциям store (getState, dispatch), у них есть ссылка к следующим Middleware в цепочке, это может быть оригинальная функция dispatch или еще один Middleware, нас это не заботит - мы просто вызываем next когда наш Middleware отработал и хочет передать контроль дальше следующему слою наших Middleware.
//И поскольку мы вызываем работу функции dispatch - последний аргумент это action, который мы можем изменить, обработать или просто проигнорировать, в зависимости от того что должен делать наш Middleware.
//Для того чтобы использовать Middleware мы используем функцию applyMiddleware (это storeEnhancer). В функцию applyMiddleware мы должны передать наши функции Middleware по очереди, здесь очередь имеет значение
 */

/*141 Thunk
Thunk Middleware - позволяет передавать в store функции как действия.
Такие функции принимают dispatch() и getState()
const getPerson = (id) => (dispatch) => { //action creator
  dispatch({ type: 'FETCH_PERSON_REQUEST' });
  fetchPerson(id) //асинхронное действие
    .then((data) => dispatch({ type: 'FETCH_PERSON_SUCCESS', data })
    .catch((error) => dispatch({ type: 'FETCH_PERSON_FAILURE', error })
}
store.dispatch(getPerson(1));

старый код fetchBooks
const fetchBooksOld = (bookstoreService, dispatch) => () => { //передаем функцию fetchBooks, а в качестве значений может быть не только АС, но вообще любая функция, которая делает все что угодно //перенесли в actions/index.js чтобы функция работала передаем сюда bookstoreService и dispatch
  dispatch(booksRequested()); //перед тем как мы отправим запрос на получение новых книг, мы вызываем АС booksRequested и соответственно установим значение loading в true и после этого мы будем отображать спиннер, до тех пор пока мы не получим данные. Теперь каждый раз когда мы будем переходить на этот компонент и этот компонент bookList будет запрашивать обновление данных - пользователь будет видеть спиннер
  bookstoreService.getBooks() //получаем данные с помощью getBooks
    .then((data) => dispatch(booksLoaded(data))) //передаем данные в this.props.booksLoaded(data) //когда получим данные, мы можем вызвать this.props.booksLoaded(data)//после получения данных вызываем функцию booksLoaded //это экшн-криэтор который вызывает dispatch и передает данные (список книг) в redux store
    .catch((err) => dispatch(booksError(err))); //помещаем в блок catch нашего промиса, то есть, если что-то пошло не так, мы получем ошибку и сразу вызываем booksError и передаем туда объект с ошибкой err
};//теперь функция fetchBooks - константа, которая будет являться функцией, которая должна возврщать функцию обернутую в "{}" - это тело функции, которые мы хотим вернуть. Для того чтобы эта функция работала нам нужны аргументы dispatch и bookstoreService, поэтому мы оборачиваем функцию в другую функцию и передадим сюда bookstoreService и dispatch. Мы не можем передать их во вторую функцию в (), потому что мы не хотим чтобы наш компонент, который будет вызывать функцию начинающуюся с 1-й "=>" напрямую зависел от этих параметров. Наш компонент должен просто вызвать функцию fetchBooks без каких-либо аргументов и запустить процесс получения книг, а остальные параметры (bookstoreService и dispatch) не должны касаться работы нашего компонента. Именно поэтому fetchBooks будет функцией, которая возвращает функцию. Внутренняя функция предназначена для компонента, внешняя для работы в mapDispatchToProps.
новый с thunk
const fetchBooks = (bookstoreService) => () => (dispatch) => {
  dispatch(booksRequested()); //перед тем как мы отправим запрос на получение новых книг, мы вызываем АС booksRequested и соответственно установим значение loading в true и после этого мы будем отображать спиннер, до тех пор пока мы не получим данные. Теперь каждый раз когда мы будем переходить на этот компонент и этот компонент bookList будет запрашивать обновление данных - пользователь будет видеть спиннер
  bookstoreService.getBooks() //получаем данные с помощью getBooks
    .then((data) => dispatch(booksLoaded(data))) //передаем данные в this.props.booksLoaded(data) //когда получим данные, мы можем вызвать this.props.booksLoaded(data)//после получения данных вызываем функцию booksLoaded //это экшн-криэтор который вызывает dispatch и передает данные (список книг) в redux store
    .catch((err) => dispatch(booksError(err))); //помещаем в блок catch нашего промиса, то есть, если что-то пошло не так, мы получем ошибку и сразу вызываем booksError и передаем туда объект с ошибкой err
};
*/

/*142 Следующие шаги
Сайт https://redux.js.org - отличный источник информации (и ссылок на другие ресурсы).
Обращайтесь к исходному коду.
Старайтесь использовать Redux в сосбственных проектах. Решайте настоящие задачи.
 */

/*143 Сборка React приложения
create-react-app - отличный инструмент для того, чтобы начать разработку на React.
Работая с WebPack напрямуб можно создавать намного более гибкие скрипты сборки.
В этом блоке мы рассмотрим WebPack, Babel и некоторые дополнительные утилиты.
 */