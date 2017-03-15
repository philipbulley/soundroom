import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth/auth.effects';
import { PlaylistCollectionEffects } from './playlist-collection/playlist-collection.effects';

export const STORE_EFFECTS = [
  AuthEffects,
  PlaylistCollectionEffects,
]
  .map(effect => EffectsModule.run(effect));
