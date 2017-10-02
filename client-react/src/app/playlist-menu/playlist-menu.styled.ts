import styled from 'styled-components';
import { contentContainer } from '../shared/layout/content-container';
import media from '../shared/layout/media';

export const PlaylistMenuStyled = styled.div`
  ${contentContainer}
  
  h2 {
    text-align: center;
  }
  
  .loading {
    text-align: center;
  }
  
  ul {
    padding: 0;
    list-style-type: none;
    vertical-align: top;
    font-size: 0;
  }
  
  li {
    display: inline-block;
    width: 100%;
    height: 420px;
    padding: 2px;
    vertical-align: top;
    font-size: 16px;
  }
  
  ${media.medium`
    li {
      width: 50%;
    }
  `}
  
  ${media.large`
    li {
      width: 33.333%;
    }
  `}
`;
