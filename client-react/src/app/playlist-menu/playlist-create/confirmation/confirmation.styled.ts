import styled from 'styled-components';

interface LayerProps {
	verticalOffset?: string;
}

export const Layer = styled.div`
	position: absolute;
	display: block;
	left: 50%;
	transform: translateX(-50%);
	margin-top: ${({ verticalOffset }: LayerProps) => verticalOffset || 0};
`;
