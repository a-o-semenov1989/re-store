import React from 'react';
import './book-list-item.css';

const BookListItem = ({ book, onAddedToCart }) => { //BookListItem принимает в качестве свойств книгу //добавляем event listener onAddedToCart
  const { title, author, price, coverImage } = book; //достаем значения из book
  return ( //вернем два span которые будут отображать эти данные, для этого используем Fragment
    <div className="book-list-item">
      <div className="book-cover">
        <img src={coverImage} alt="cover"/>
      </div>
      <div className="book-details">
        <span className="book-title">{title}</span>
        <div className="book-author">{author}</div>
        <div className="book-price">{price}</div>
        <button
          onClick={onAddedToCart}
          className="btn btn-info add-to-cart">
          Add to cart
        </button>
      </div>

    </div>
  );
};

export default BookListItem;