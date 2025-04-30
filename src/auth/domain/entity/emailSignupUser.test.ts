import { generateSecurePassword } from 'src/constants';
import { EmailSignupUser } from './emailSignupUser';
import { UserEmail } from './userEmail';
import { UserPassword } from './userPassword';
import { faker } from '@faker-js/faker';

describe('EmailSignupUser', () => {
  it('이메일과 비밀번호가 주어지면, 성공한다.', () => {
    const validEmail = faker.internet.email();
    const validPassword = generateSecurePassword();

    const email = UserEmail.create(validEmail);
    if (email.isErr()) throw new Error('email is err');
    const password = UserPassword.create(validPassword);
    if (password.isErr()) throw new Error('password is err');

    const emailSignupUser = EmailSignupUser.create({
      email: email.value,
      password: password.value,
    });
    expect(emailSignupUser.isOk()).toBe(true);
    if (emailSignupUser.isErr()) throw new Error('emailSignupUser is err');
    expect(emailSignupUser.value.email).toBe(email.value);
    expect(emailSignupUser.value.password).toBe(password.value);
  });
});
