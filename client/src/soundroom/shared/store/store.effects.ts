import { EffectsModule } from '@ngrx/effects';

export const STORE_EFFECTS = [
  //
]
  .map(effect => EffectsModule.run(effect));
