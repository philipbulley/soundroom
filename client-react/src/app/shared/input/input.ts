import styled, { css } from 'styled-components';

const Input = styled.input`
	${props =>
		props.type === 'text'
			? css`
					padding: 14px 14px;
					width: 100%;
					margin-bottom: 10px;
					border: 0;
					outline: 0;
					border-radius: 4px;
			  `
			: ``};
`;

export default Input;
