import styled from 'styled-components';
import colors from '../shared/colors/colors';
import { contentContainer } from '../shared/layout/content-container';

export default styled.header`
    position: sticky;
    height: 60px;
    background-color: ${colors.white};
    border-bottom: ${colors.greyDust} 1px solid;
    
    line-height: 60px;
    
    nav {
      display: flex;
      ${contentContainer}
    }
    
    .main {
      flex: 2 1 auto;
    }
    
    .meta {
      flex: 1 1 auto;
      text-align: right;
    }
`;
