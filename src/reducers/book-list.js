const updateBookList = (state, action) => {

  if (state === undefined) { //если наш стейт undefined, мы вернем первоначальный стейт для bookList
    return {
      books: [],
      loading: true,
      error: null //по умолчанию ошибок нет
    }
  }

  switch (action.type) {
    case 'FETCH_BOOKS_REQUEST':
      return {
        books: [], //поскольку в redux state надо указывать все состояние (здесь например state.books - это книги из предыдущего уже полученного массива книг, или [] - это значит пустой массив)
        loading: true, //идет загрузка книг
        error: null //мы начали новый запрос, ошибок еще нет
      };

    case 'FETCH_BOOKS_SUCCESS': //если произошло это действие action payload будет содержать новый массив книг который мы загрузили
      return { //когда мы получили событие BOOKS_LOADED это значит что книги уже загружены и в этот момент, кроме того что мы обновляем книги, нам нужно сказать что loading теперь будет false
        books: action.payload,
        loading: false, //книги уже загрузились
        error: null //в случае успешной загрузки книг, ошибок нет
      };

    case 'FETCH_BOOKS_FAILURE': //в случае ошибки сервиса
      return {
        books: [], //возвращаем пустой массив книг, поскольку в случае ошибки у нас нет книг
        loading: false, //в случае ошибки загрузка уже завершена
        error: action.payload //если нам пришла ошибка, мы получаем ее из action.payload// мы передадим в наш reducer через action значение той ошибки, которая у нас произошла. После этого любой компонент в нашем приложении сможет прочитать детали той ошибки, что произошла при загрузке книг и решить каким способом отобразить эту ошибку
      };

    default:
      return state.bookList; //если мы не знаем что делать с действием, мы будем возвращать существующий bookList
  }

};

export default updateBookList;