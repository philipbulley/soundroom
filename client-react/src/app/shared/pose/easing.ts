import { easing } from 'popmotion';

const { createExpoIn, createReversedEasing, createMirroredEasing } = easing;

export const expoEaseIn = createExpoIn(4);
export const expoEaseInOut = createMirroredEasing(expoEaseIn);
export const expoEaseOut = createReversedEasing(expoEaseIn);
