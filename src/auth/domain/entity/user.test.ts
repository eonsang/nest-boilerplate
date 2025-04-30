import { faker } from '@faker-js/faker/.';
import { User } from './user';

describe('User', () => {
  it('should return Ok. if correct userId and email are passed', () => {
    const email = faker.internet.email();
    const user = User.create({ id: '1', email });
    expect(user.isOk()).toBe(true);
  });

  it('should return Err. if incorrect params are passed', () => {
    const user = User.create({ id: '1', email: 'invalid-email' });
    expect(user.isErr()).toBe(true);
  });
});
