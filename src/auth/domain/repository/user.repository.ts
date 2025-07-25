import { EmailSignupUser, User, UserEmail } from '../entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export interface UserRepository {
  existsByEmail(email: UserEmail): Promise<boolean>;
  createUser(user: EmailSignupUser): Promise<User>;
}
