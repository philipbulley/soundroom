import * as React from 'react';
import { store } from './shared/store/store';
import { Provider } from 'react-redux';
import Routes from './routes/routes';
import { AppStyled } from './app.styled';

const App = () => (
  <Provider store={store}>
    <AppStyled>
      <Routes/>
    </AppStyled>
  </Provider>
);

export default App;
