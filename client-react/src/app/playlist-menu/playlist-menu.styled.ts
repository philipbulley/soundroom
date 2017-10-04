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
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    list-style-type: none;
  }
  
  li {
    width: 100%;
    height: 420px;
    padding: 2px;
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
