import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/auth.effects';

export const STORE_EFFECTS = [
  AuthEffects,
]
  .map(effect => EffectsModule.run(effect));
