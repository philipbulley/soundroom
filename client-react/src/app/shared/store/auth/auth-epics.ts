import { loadUserEpic } from './load-user/load-user.epic';
import { loadUserSuccessEpic } from './load-user-success/load-user-success.epic';
import { loadUserErrorEpic } from './load-user-error/load-user-error.epic';

export const authEpics = [loadUserEpic, loadUserSuccessEpic, loadUserErrorEpic];
