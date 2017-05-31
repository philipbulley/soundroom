import * as React from 'react';
import { create } from 'react-test-renderer';
import Icon from './icon';

describe('<Icon />', () => {
  it('should render an icon based on id', () => {
    const icon = create(<Icon id="spotify"/>).toJSON();
    expect(icon).toMatchSnapshot();
  });

  it('should pass a className prop through', () => {
    const icon = create(<Icon id="spotify" className="foobar-123"/>).toJSON();
    expect(icon).toMatchSnapshot();
  });

  it('should pass allow a size to be specified', () => {
    const icon = create(<Icon id="spotify" size="3"/>).toJSON();
    expect(icon).toMatchSnapshot();
  });
});
