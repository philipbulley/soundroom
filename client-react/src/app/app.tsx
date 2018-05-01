import * as React from 'react';
import { store } from './shared/store/store';
import { Provider } from 'react-redux';
import Routes from './routes/routes';
import styled from 'styled-components';
import colors from './shared/colors/colors';

const App = () => (
	<Provider store={store}>
		<AppStyled>
			<Routes />
		</AppStyled>
	</Provider>
);

export const AppStyled = styled.div`
	background-color: ${colors.whiteDusty};
	min-height: 100vh;
`;

export default App;
