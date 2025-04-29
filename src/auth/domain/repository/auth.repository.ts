import { User } from '../entity';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');
export interface AuthRepository {
  saveRefreshToken(user: User, refreshToken: string): Promise<void>;
}
