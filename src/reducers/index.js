import updateBookList from './book-list';
import updateShoppingCart from './shopping-cart';

const reducer = (state, action) => { //reducer это функция которая принимает 2 аргумента: state с которым мы сейчас работаем и action которое мы пытаемся выполнить
  return {
    bookList: updateBookList(state, action),
    shoppingCart: updateShoppingCart(state, action)
  };
};//теперь наш редюсер состоит из 2 независимых функций и каждая из них обновляет свою часть глобального стейта

export default reducer;
