import React, { Component } from 'react';
import BookListItem from '../book-list-item';
import Spinner from '../spinner';
import ErrorIndicator from '../error-indicator';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withBookstoreService } from '../hoc';
import { fetchBooks, bookAddedToCart } from '../../actions';
import { compose } from '../../utils';

import './book-list.css';

const BookList = ({ books, onAddedToCart }) => { //обычный функциональный компонент - его задача только отображать список книг. Он не заботится о том откуда этот список книг, загружен ли он полностью. Он считает что этот список книг есть и он в хорошем валидном состоянии. Единственное что ему нужно для работы это свойство books  //получаем event listener onAddedToCart
  return ( //возвращаем ul, для каждой книги мы вернем li внутри которого будет компонент BookListItem, которому мы передадим свойство book, которое мы получили из коллекции //отрисовываем на экране
    <ul className="book-list">
      {
        books.map((book) => { // пройдется по списку книг и для каждого элемента списка он вернет новый li, в котором будет записан BookListItem
          return (
            <li key={book.id}>
              <BookListItem
                book={book}
                onAddedToCart={() => onAddedToCart(book.id)} /*добавляем event listener onAddedToCart, создаем функцию и вызываем наш onAddedToCart, ту функцию, которую получит BookList, и сюда мы передаем book.id*/ />
            </li>
          );
        })
      }
    </ul>
  )
};

class BookListContainer extends Component {

  componentDidMount() {
    this.props.fetchBooks(); //передаем сюда функцию fetchBooks//вызывая эту функцию, наш компонент запускает логику получения данных, а затем единственное за что отвечает - за рендеринг
  }

  render() { //для того чтобы отрендерить данные, нам нужно получить список книг
    const { books, loading, error, onAddedToCart } = this.props; //получаем список книг из props (свойство с названием books и там будет содержаться массив книг)// получаем список книг из redux store //достаем loading из redux store //получаем onAddedToCart из свойств компонента
    if (loading) { //если еще нет книг и мы ждем, возвращаем компонент spinner
      return <Spinner />
    }

    if (error) { //если ошибка - вместо отображения деталей книг, мы возвращаем ErrorIndicator
      return <ErrorIndicator />
    }

    return <BookList books={books} onAddedToCart={onAddedToCart} />; //используем BookList в BookListContainer //передаем onAddedToCart в BookList
  }
}

const mapStateToProps = ({ bookList: { books, loading, error }}) => { //определяем функцию чтобы передать массив books из redux store// принимает state и возвращает объект где ключи это названия свойств, которые мы присвоим нашему компоненту, а значения это те значения из state, которые мы присвоим// деструктурируем books из state //получаем еще loading из redux store //из нашего глобального стейта передаем сюда ошибку
  return { books, loading, error } //в наш компонент нужно будет передать свойство books, а значением для этого свойства будет выступать state.books, где state это наш глобальный state из redux store //теперь loading будет доступен компоненту и мы можем использовать его для рендера //передаем error как свойство нашего компонента, значение error будет null, если ошибки нет
};

const mapDispatchToProps = (dispatch, { bookstoreService }) => { //функциональная форма. принимает метод dispatch и эта функция возврщает объект //ownProps это те свойства, которые перешли компоненту, который создает коннект (connect(mapStateToProps, mapDispatchToProps). Таким образом мы получим сервис (bookstoreService) //получаем и сразу деструктурируем сервис из ownProps, теперь мы можем его использовать в функции fetchBooks
  return bindActionCreators({ //объект имеет точно такую же структуру как у mapStateToProps (в качестве ключей мы передаем названия свойств, которые получит наш компонент)
    fetchBooks: fetchBooks(bookstoreService), //передаем функцию, вызываем dispatch вручную и передаем туда результат АС - (fetchBooks(bookstoreService)()) и вызвать сам АС для того чтобы создать действие
    onAddedToCart: bookAddedToCart //вызываем dispatch, передаем в dispatch результат bookAddedToCart с правильным значением id
  }, dispatch); //bindActionCreators в качестве 1 агрумента принимает объект с АС(1 АС - fetchBooks(bookstoreService), во второй строке - bookAddedToCart(id), а в качестве 2 - функцию dispatch
};//отрефакторил под thunk

export default compose(
  withBookstoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(BookListContainer);
//connect это функция, которая возвращает функцию, поэтому в 1 функцию мы должны передать конфигурацию как именно подключать наш BookList, (первая часть конфигурации описывает то, какие данные будет получать компонент из redux store)
// а во 2 результирующую мы передаем BookList
//и вся эта конструкция вернет новый компонент, который уже будет знать о редакс store и сможет с ним работать
//мы экспортируем не оригинальный BookList, а результат функции connect
//оборачиваем все в withBookService чтобы получить данные из сервиса контекст. передаем в withBookstoreService результат функции connect
//таким образом наш компонент оборачивается двумя НОС - сначала connect, затем - withBookstoreService.
//mapDispatchToProps в качестве второго аргумента передаем функции connect


//Жизненный цикл нашего компонента BooksList (126 урок):
//в нашем приложении мы начинаем с пустого массива в redux store, то есть нет никаких книг. Как только наш компонент загружается, происходит несколько действий - функция connect оборачивает BookList в НОС, который подключается к redux store.
// Мы конфигурируем то, как именно работает это подключение при помощи функций mapStateToProps и mapDispatchToProps. mapStateToProps описывает то, какие данные наш компонент хочет получить из redux store (мы хотим получить массив books). mapDispatchToProps описывает то, какие действия захочет выполнить наш компонент, какие action-ы он будет передавать в store.
// Таким образом когда наш компонент появляется на экране происходит несколько действий, во первых мы получаем сервис из контекста (мы его получаем при помощи другого НОС - withBookstoreService). Поскольку у нас есть доступ к сервису, значит мы можем получить данные.
//Мы получаем данные и сразу же вызываем функцию booksLoaded (это уже не обычный АС, он не просто создает действия, а автоматически передает action в redux store), мы передаем те данные что получили от сервиса в store. Store вызывает наш reducer, reducer получает действие 'BOOKS_LOADED' и обновляет список книг (books: action.payload) в store.
// Обновленный список книг снова возвращается к нашему компоненту BookList через mapStateToProps через коллекцию { books }. Наш компонент получает обновленный список книг и в функции render отрисовывает этот список на экране.

//Мы разделили компонент на 2 части, 1 часть - контейнер, который отвечает за поведение, а 2 - BooksList отвечает за отрисовку