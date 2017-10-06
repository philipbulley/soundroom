import { ThemedStyledFunction } from 'styled-components';

/**
 * Allows creation of a styled component whilst specifying the type for it's props
 *
 * From: https://github.com/styled-components/styled-components/issues/630#issuecomment-317277803
 */
export const styledWithProps = <U>() =>
  <P, T, O>(
    fn: ThemedStyledFunction<P, T, O>
  ): ThemedStyledFunction<P & U, T, O & U> => fn;
