import colors from './colors';
import { SocialProvider } from '../model/social-provider';

const socialProviderColorMap = {
  google: colors.red,
  spotify: colors.green,
  facebook: colors.blueDirty,
  twitter: colors.blueClean,
};

export function getSocialProviderColor(provider: SocialProvider) {
  return socialProviderColorMap[provider];
}
