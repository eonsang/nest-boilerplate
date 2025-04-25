import { faker } from '@faker-js/faker/.';
import { UserEmail } from './userEmail';

describe('UserEmail', () => {
  it('이메일 형식이 올바르면, 성공한다.', () => {
    const userEmail = UserEmail.create(faker.internet.email());
    expect(userEmail.isOk()).toBe(true);
  });

  it('이메일 형식이 올바르지 않으면, 실패한다.', () => {
    const userEmail = UserEmail.create('test');
    expect(userEmail.isErr()).toBe(true);
  });
});
