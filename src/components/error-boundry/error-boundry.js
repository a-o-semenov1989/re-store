import React, { Component } from 'react';
import ErrorIndicator from '../error-indicator';

export default class ErrorBoundry extends Component { //делаем как компонент-класс, поскольку есть метод жизненного цикла

  state = { //для сохранения еррор баундри и переключения в режим отображения ошибки нам понадобится стейт
    hasError: false
  };

  componentDidCatch() { //вызовется когда в одном из компонентов ниже по иерархии ErrorBoundry возникла ошибка (в методе рендер или другом компоненте жизненного цикла)
    this.setState({ hasError: true }); //если сработает componentDidCatch переводим стейт hasError в true
  }

  render() {
    if (this.state.hasError) {
      return <ErrorIndicator />;
    }

    return this.props.children;
  }
}