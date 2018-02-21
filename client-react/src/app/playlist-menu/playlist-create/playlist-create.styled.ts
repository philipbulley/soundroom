import styled from 'styled-components';
import Button from '../../shared/button/button';
import colors from '../../shared/colors/colors';

interface StepProps {
  num: number;
}

export default styled.div`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  background-color: ${colors.green};
`;

interface StepsProps {
  stepsTotal: number;
}

export const Steps = styled.div`
  display: flex;
  width: ${({stepsTotal}: StepsProps) => stepsTotal * 100}%;
  height: 100%;
`;

export const Step = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  justify-content: center;
  width: 100%;
  padding: 30px;
  color: ${colors.white};
  
  // justify-content: ${({num}: StepProps) => num === 0 ? 'center' : 'flex-start'}
`;

export const ButtonContainer = styled.div`
  display: flex;
  
  > * {
    flex: 1 1 auto;
  }
`;

export const Confirmation = styled.div`
  .icon {
    display: block;
    margin-bottom: 30px;
  }
  
  .button {
    display: block;
    margin: 30px auto 0 auto;
  }
`;

export const PaddedButton = Button.extend`
  padding: 14px;
`;
