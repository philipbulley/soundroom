import * as React from 'react';
import styled from 'styled-components';
import colors from '../../colors/colors';

const InlineError = ({message, status, children}: Props) => {
  const statusStr = typeof status !== 'undefined' ? 'status:' + status : null;
  const extra = statusStr && message
    ? statusStr + ' | ' + message
    : statusStr || message;

  return (
    <InlineErrorStyled>
      {children} <ExtraInfo>{extra && `[${extra}]`}</ExtraInfo>
    </InlineErrorStyled>
  );
};

interface Props {
  /** An error message potentially from the server */
  message?: string;

  /* The network status code if available */
  status?: number;

  /** A custom user-friendly error message */
  children?: any;
}

const InlineErrorStyled = styled.div`
  padding: 10px;
  background-color: ${colors.red};
  color: ${colors.white};
`;

const ExtraInfo = styled.div`
  display: inline;
  color: ${colors.black};
  font-size: .7em;
`;

export default InlineError;
