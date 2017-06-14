import * as React from 'react';
import { store } from './shared/store/store';
import { Provider } from 'react-redux';
import Routes from './routes/routes';

// const onClick = (path: string) => {
//   store.dispatch(push(path));
// };

const App = () => (
  <Provider store={store}>
    <div>
      <Routes/>
    </div>
  </Provider>
);

export default App;
