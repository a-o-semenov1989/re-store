import React from 'react';
import { BookstoreServiceConsumer } from '../bookstore-service-context';

const withBookstoreService = () => (Wrapped) => {

  return (props) => { //возвращаем функцию, которая принимает props
    return ( //функция возвращает кусок jsx разметки //оборачиваем компонент в BookstoreServiceConsumer// функция принимает на вход bookstoreService (сервис который мы передаем) и возвращает оборачиваемый компонент (не забыв передать ему все свойства которые получил наш компонент) и добавив в наш вложенный компонент свойство bookstoreService, передав тот сервис что мы получили из контекста
      <BookstoreServiceConsumer>
        {
          (bookstoreService) => {
            return (<Wrapped {...props}
                     bookstoreService={bookstoreService}/>);
          }
        }
      </BookstoreServiceConsumer>
    );
  }
};

export default withBookstoreService;
