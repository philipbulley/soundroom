import styled from 'styled-components';
import Button from '../../shared/button/button';
import colors from '../../shared/colors/colors';
import posed from 'react-pose';
import { expoEaseInOut } from '../../shared/pose/easing';

interface StepProps {
	num: number;
}

const PlaylistCreateStyled = styled.div`
	position: relative;
	display: block;
	width: 100%;
	height: 100%;
	overflow: hidden;
	text-align: center;
	background-color: ${colors.green};
`;
export default PlaylistCreateStyled;

export const OverflowHidden = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
`;

interface StepsProps {
	step: number;
	stepsTotal: number;
	pose: string;
	onPoseComplete: Function;
}
const stepPoseConfig = {
	x: ({ step, stepsTotal }) => `${-100 / stepsTotal * step}%`,
	transition: {
		duration: 600,
		ease: expoEaseInOut
	}
};

export const StepsPosed = posed.div({
	step0: stepPoseConfig,
	step1: stepPoseConfig
});

// export const Steps = styled.div`
export const Steps = styled(StepsPosed)`
	display: flex;
	width: ${({ stepsTotal }: StepsProps) => stepsTotal * 100}%;
	height: 100%;
`;

export const Step = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: center;
  width: 100%;
  padding: 30px;
  color: ${colors.white};

  // justify-content: ${({ num }: StepProps) => (num === 0 ? 'center' : 'flex-start')}
`;

export const ButtonContainer = styled.div`
	display: flex;

	> * {
		flex: 1 1 auto;
	}
`;

export const PaddedButton = styled(Button)`
	padding: 14px;
`;
