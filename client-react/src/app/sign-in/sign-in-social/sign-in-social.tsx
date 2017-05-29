import * as React from 'react';

export const SignInSocial = ({serverBaseUrl}) => (
  <div>
    <p>
      If you've signed in before, please use the same social sign-in option as before.
    </p>

    <ul>
      <li>
        <a href={serverBaseUrl + '/auth/google'} className="social-link google">
          <i className="fa fa-google fa-3x"/>
        </a>
      </li>
      <li>
        <a href={serverBaseUrl + '/auth/spotify'} className="social-link spotify">
          <i className="fa fa-spotify fa-3x"/>
        </a>
      </li>
      <li>
        <a href={serverBaseUrl + '/auth/twitter'} className="social-link twitter">
          <i className="fa fa-twitter fa-3x"/>
        </a>
      </li>
      <li>
        <a href={serverBaseUrl + '/auth/facebook'} className="social-link facebook">
          <i className="fa fa-facebook fa-3x"/>
        </a>
      </li>
    </ul>
  </div>
);
