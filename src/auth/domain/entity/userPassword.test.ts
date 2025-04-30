import { generateSecurePassword } from 'src/constants';
import { UserPassword } from './userPassword';

describe('UserPassword', () => {
  it('should return error if password is not valid', () => {
    const userPassword = UserPassword.create('password');
    expect(userPassword.isErr()).toBe(true);
  });

  it('should return user password if password is valid', () => {
    const userPassword = UserPassword.create(generateSecurePassword());
    expect(userPassword.isOk()).toBe(true);
  });
});
