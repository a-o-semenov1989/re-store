const updateCartItems = (cartItems, item, idx) => { //принимает на вход аргументы cartItems, элемент который мы будем обновлять item, idx для того чтобы знать куда вставлять этот элемент

  if (item.count === 0) { //если у нас больше нет книг, удаляем путем создания нового массива
    return [
      ...cartItems.slice(0, idx), //cartItems от нуля до индекса
      ...cartItems.slice(idx + 1) //все элементы после индекса, таким образом создастся массив со всеми элементами, кроме удаленного
    ];
  }

  if (idx === -1) { //если наш индекс -1, это означает что это новый элемент и поэтому его нужно просто добавить в массив
    return [ //возвращаем новый массив, который состоит из всех элементов cartItems плюс новый item
      ...cartItems,
      item
    ];
  }

  return [  //если индекс любое другое число - обновляем существующий массив
    ...cartItems.slice(0, idx), //cartItems от нуля до индекса
    item, //затем новый item
    ...cartItems.slice(idx + 1) //затем массив от idx + 1 до конца
  ];
};

const updateCartItem = (book, item = {}, quantity) => { //передаем сюда книгу, добавляемую к заказу, еще элемент списка заказов, который мы будем обновлять, если элемет undefined мы знаем что такого элемента не существует, то это значит что это первая книжка, которую нужно создать //если item undefined, то он будет пустым элементом, пустым объектом //передаем сюда quantity - количество

  const {
    id = book.id,
    count = 0,
    title = book.title,
    total = 0 } = item; //получаем значения с помощью деструктуризации из item, если этих значений в item нет и он пустой объект, мы дадим им значение по умолчанию

  return { //возвращаем объект, у которого id такой же как раньше, count это count + 1, total это total + book.price
    id,
    title,
    count: count + quantity, //прибавляем количество (если оно -1, то будет убавление, в противном случае добавление)
    total: total + quantity*book.price
  }
};

const updateOrder = (state, bookId, quantity) => { //нам нужен текущий state, bookId
  const { bookList: { books }, shoppingCart: { cartItems }} = state; //деструктурируем из state

  const book = books.find(({ id }) => id === bookId); //ищем в коллекции книг информацию о книге по id //деструктурируем id из book
  const itemIndex = cartItems.findIndex(({ id }) => id === bookId); //ищем индекс элемента, у которого айди точно такой же как айди книги с которой мы сейчас работаем, в массиве. И этот айтем индекс элемента может быть либо индекс элемента либо -1, если такого элемента не существует. нам нужен этот индекс чтобы знать какой элемент обновлять
  const item = cartItems[itemIndex]; //если индекс -1, то есть элемента не существует, это выражение даст нам item = undefined, ошибки не будет

  const newItem = updateCartItem(book, item, quantity);
  return { //возвращаем новый стейт, у которого будут все те же элементы, что и у старого стейта, кроме элемента cartItems, который будет новым массивом у которого будут все те же элементы cartItems плюс новый элемент newItem
    orderTotal: 0,
    cartItems: updateCartItems(cartItems, newItem, itemIndex) //cartItems это updateCartItems
  };
};

const updateShoppingCart = (state, action) => {

  if (state === undefined) {
    return {
      cartItems: [],
      orderTotal: 0
    }
  }

  switch (action.type) {
    case 'BOOK_ADDED_TO_CART':
      return updateOrder(state, action.payload, 1); //в качестве 3 аргумента - quantity передаем 1, таким образом книга добавится

    case 'BOOK_REMOVED_FROM_CART':
      return updateOrder(state, action.payload, - 1); //в качестве quantity передаем -1, таким образом книга убавится

    case 'ALL_BOOKS_REMOVED_FROM_CART':
      const item = state.shoppingCart.cartItems.find(({id}) => id === action.payload); //ищем элемент в заказе с нужным айди
      return updateOrder(state, action.payload, - item.count); //в качестве quantity передаем -item.count(количество книг), таким образом все книги удалятся

    default:
      return state.shoppingCart;
  }
};

export default updateShoppingCart;