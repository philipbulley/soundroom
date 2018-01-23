import * as React from 'react';
import { create } from 'react-test-renderer';
import { MOCK_USER } from '../model/user/user.mock';
import Avatar from './avatar';

describe('<Avatar />', () => {
  it('should render a medium sized avatar', () => {
    const avatar = create(<Avatar size="medium" user={MOCK_USER}/>).toJSON();
    expect(avatar).toMatchSnapshot();
  });

  it('should render a small sized avatar', () => {
    const avatar = create(<Avatar size="small" user={MOCK_USER}/>).toJSON();
    expect(avatar).toMatchSnapshot();
  });
});
