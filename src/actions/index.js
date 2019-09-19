
const booksLoaded = (newBooks) => {
  return {
    type: 'FETCH_BOOKS_SUCCESS', //тип действия который ожидает reducer //SUCCESS - означает успешное получение книг
    payload: newBooks
  };
};

const booksRequested = () => { //этот AC создает объект у которого есть только тип действия, это все что нам надо чтобы установить loading: true
  return {
    type: 'FETCH_BOOKS_REQUEST', //FETCH обозначает что мы получаем данные, а не обновляем. UPDATE - обновляем
  }
};

const booksError = (error) => { //принимает на вход объект - ошибку, которую мы получили от сервиса
  return { //создает новый объект - действие с типом 'FETCH_BOOKS_FAILURE', тот тип действия что мы ожидаем получить в reducer-e
    type: 'FETCH_BOOKS_FAILURE', //FAILURE - ошибка получения книг
    payload: error //затем сохраняет нащ объект с ошибкой под именем payload в объекте action
  }
};

export const bookAddedToCart = (bookId) => { //передаем сюда AC bookId, чтобы получить ID книги
  return {//возрвращаем новое действие и называем его
    type: 'BOOK_ADDED_TO_CART',
    payload: bookId //в качестве значения payload передаем bookId
  };
};

export const bookRemovedFromCart = (bookId) => { //передаем сюда AC bookId, чтобы получить ID книги
  return {//возрвращаем новое действие и называем его
    type: 'BOOK_REMOVED_FROM_CART',
    payload: bookId //в качестве значения payload передаем bookId
  };
};

export const allBooksRemovedFromCart = (bookId) => { //передаем сюда AC bookId, чтобы получить ID книги
  return {//возрвращаем новое действие и называем его
    type: 'ALL_BOOKS_REMOVED_FROM_CART',
    payload: bookId //в качестве значения payload передаем bookId
  };
};
/*
const fetchBooksOld = (bookstoreService, dispatch) => () => { //передаем функцию fetchBooks, а в качестве значений может быть не только АС, но вообще любая функция, которая делает все что угодно //перенесли в actions/index.js чтобы функция работала передаем сюда bookstoreService и dispatch
  dispatch(booksRequested()); //перед тем как мы отправим запрос на получение новых книг, мы вызываем АС booksRequested и соответственно установим значение loading в true и после этого мы будем отображать спиннер, до тех пор пока мы не получим данные. Теперь каждый раз когда мы будем переходить на этот компонент и этот компонент bookList будет запрашивать обновление данных - пользователь будет видеть спиннер
  bookstoreService.getBooks() //получаем данные с помощью getBooks
    .then((data) => dispatch(booksLoaded(data))) //передаем данные в this.props.booksLoaded(data) //когда получим данные, мы можем вызвать this.props.booksLoaded(data)//после получения данных вызываем функцию booksLoaded //это экшн-криэтор который вызывает dispatch и передает данные (список книг) в redux store
    .catch((err) => dispatch(booksError(err))); //помещаем в блок catch нашего промиса, то есть, если что-то пошло не так, мы получем ошибку и сразу вызываем booksError и передаем туда объект с ошибкой err
};
//теперь функция fetchBooks - константа, которая будет являться функцией, которая должна возврщать функцию обернутую в "{}" - это тело функции, которые мы хотим вернуть. Для того чтобы эта функция работала нам нужны аргументы dispatch и bookstoreService, поэтому мы оборачиваем функцию в другую функцию и передадим сюда bookstoreService и dispatch. Мы не можем передать их во вторую функцию в (), потому что мы не хотим чтобы наш компонент, который будет вызывать функцию начинающуюся с 1-й "=>" напрямую зависел от этих параметров. Наш компонент должен просто вызвать функцию fetchBooks без каких-либо аргументов и запустить процесс получения книг, а остальные параметры (bookstoreService и dispatch) не должны касаться работы нашего компонента. Именно поэтому fetchBooks будет функцией, которая возвращает функцию. Внутренняя функция предназначена для компонента, внешняя для работы в mapDispatchToProps.
*/
const fetchBooks = (/*функция которая возвращает АС, принимает bookstoreService*/bookstoreService) => (/*нет аргументов, поскольку мы получаем весь список книг, если бы нам нужно было что-то конкретное, сюда можно добавить id той книги, что нужно получить*/) => (dispatch) => {
  dispatch(booksRequested()); //перед тем как мы отправим запрос на получение новых книг, мы вызываем АС booksRequested и соответственно установим значение loading в true и после этого мы будем отображать спиннер, до тех пор пока мы не получим данные. Теперь каждый раз когда мы будем переходить на этот компонент и этот компонент bookList будет запрашивать обновление данных - пользователь будет видеть спиннер
  bookstoreService.getBooks() //получаем данные с помощью getBooks
    .then((data) => dispatch(booksLoaded(data))) //передаем данные в this.props.booksLoaded(data) //когда получим данные, мы можем вызвать this.props.booksLoaded(data)//после получения данных вызываем функцию booksLoaded //это экшн-криэтор который вызывает dispatch и передает данные (список книг) в redux store
    .catch((err) => dispatch(booksError(err))); //помещаем в блок catch нашего промиса, то есть, если что-то пошло не так, мы получем ошибку и сразу вызываем booksError и передаем туда объект с ошибкой err
};

export {
  fetchBooks, //нам больше не нужно экспортировать booksLoaded, booksError и booksRequested, поскольку единственное место где используются эти АС - внутри fetchBooks
};