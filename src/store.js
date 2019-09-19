import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

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
  thunkMiddleware, stringMiddleware, logMiddleware)); //создаем store//applyMiddleware передается в качестве последнего аргумента

const delayedActionCreator = (timeout) => (dispatch) => {
  setTimeout(() => dispatch({
    type: 'DELAYED_ACTION'
  }), timeout)
};

store.dispatch(delayedActionCreator(3000));

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