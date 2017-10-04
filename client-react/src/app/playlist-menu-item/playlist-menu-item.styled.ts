import styled from 'styled-components';
import Button from '../shared/button/button';
import colors from '../shared/colors/colors';

export const PlaylistMenuItemStyled = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 30px;
  text-align: center;
  background-color: #fff;
`;

export const CloseButton = styled(Button)`
  position: absolute;
  right: 30px;
  display: inline-block;
  float: right;
  padding: 3px;

  font-size: 16px;
  font-weight: bold;
  color: ${colors.greyDust};

  &:hover {
    color: ${colors.greyGrime};
  }
  
  // TODO: Add is-delete-confirm functionality
`;
