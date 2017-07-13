import styled from 'styled-components';
import colors from '../shared/colors/colors';

export default styled.nav`
    position: sticky;
    width: 100%;
    height: 60px;
    background-color: ${colors.white};
    border-bottom: ${colors.greyDust} 1px solid;
    
    .content-container {
      display: flex;
      line-height: 60px;
    }
    
    .main {
      flex: 2 1 auto;
    }
    
    .meta {
      flex: 1 1 auto;
      text-align: right;
    }
`;
