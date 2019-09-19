
export default class BookstoreService {

  data = [
    {
      id: 1,
      title: 'Production-Ready Microservices',
      author: 'Susan J. Fowler',
      price: 32,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/41yJ75gpV-L._SX381_BO1,204,203,200_.jpg'},
    {
      id: 2,
      title: 'Release It!',
      author: 'Michael T. Nygard',
      price: 45,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/414CRjLjwgL._SX403_BO1,204,203,200_.jpg'}
  ];

  getBooks() { //возвращает промис
    return new Promise((resolve, reject) =>  { //в промис мы передаем функцию, эта функция примет 2 функции: resolve(вызывается когда все хорошо и данные мы получили), reject мы могли бы вызвать чтобы сказать что у нас была ошибка
      setTimeout(() => { //здесь вызываем setTimeout
        if (Math.random() > 0.75) { //в одном случае из 4 - возвращаем ошибку, в остальных - получаем данные
          reject(new Error('Something bad happened')); //вызываем reject и сообщаем что произошла ошибка
        } else {
          resolve(this.data); //в качестве первого аргумента передаем функцию, которая вызовет resolve и передаст this.data
        }
      }, 700); //эти данные станут доступны через 700 милисекунд, чтобы симулировать задержку получения данных с сервера
    })
  }

}