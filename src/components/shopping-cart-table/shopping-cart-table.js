import React from 'react';
import { connect } from 'react-redux';

import {
  bookAddedToCart,
  bookRemovedFromCart,
  allBooksRemovedFromCart } from "../../actions";

import './shopping-cart-table.css';

const ShoppingCartTable = ({ items, total, onIncrease, onDecrease, onDelete }) => { //передаем сюда все необходимое компоненту, элементы таблицы, которые мы будем отображать
  const renderRow = (item, idx) => { //отвечает за то чтобы отрендерить одну строку нашей таблицы. Принимает на вход item (это элемент нашей таблицы, который мы хотим отрендерить), он будет приходить из Redux Store. idx - индекс элемента в массиве, это значение передаст функция map
    const { id, title, count, total } = item; //затем мы получаем данные из item (id - мы будем использовать это значение в наших обработчиках событий и свойства name - название товара, count - количество, total - общая сумма заказа)
    return (
      <tr key={id}>
        <td>{idx + 1}</td>
        <td>{title}</td>
        <td>{count}</td>
        <td>${total}</td>
        <td>
          <button
            onClick={() => onDelete(id)}
            className="btn btn-outline-danger btn-sm float-right">
            <i className="fa fa-trash-o" />
          </button>
          <button
            onClick={() => onIncrease(id)}
            className="btn btn-outline-success btn-sm float-right">
            <i className="fa fa-plus-circle" />
          </button>
          <button
            onClick={() => onDecrease(id)}
            className="btn btn-outline-warning btn-sm float-right">
            <i className="fa fa-minus-circle" />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="shopping-cart-table">
      <h2>Your Order</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Count</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
        { items.map(renderRow) }
        </tbody>
      </table>

      <div className="total">
        Total: ${total}
      </div>
    </div>
  );
};

const mapStateToProps = ({ shoppingCart: { cartItems, orderTotal }}) => {//принимает state, сразу деструктурируем нужные значения
  return { //возвращает объект, ключи у которого это свойства, что мы присваиваем нашему компоненту, а значения это знчения из стейта, которые мы будем использовать
    items: cartItems,
    total: orderTotal
  }
};

const mapDispatchToProps = { //функции вызывают АС с нужными параметрами и затем передавать созданное действие в Redux Store //в данном случае мы передаем mapDispatchToProps как обычный объект, а не функцию, тогда Redux обернет результирующие функции в bindActionCreators и сделает так, чтобы АС автоматически передавали свои действия в Redux Store
  onIncrease: bookAddedToCart,
  onDecrease: bookRemovedFromCart,
  onDelete: allBooksRemovedFromCart
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCartTable);