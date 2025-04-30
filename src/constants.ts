import { faker } from '@faker-js/faker/.';

// 비밀번호 전규식
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]).{8,20}$/;

// 정규식에 맞는 랜덤 패스워드 생성
export function generateSecurePassword(): string {
  const letters = faker.string.alpha({ length: 5, casing: 'mixed' }); // 대소문자 포함
  const number = faker.string.numeric(2);
  const special = faker.helpers.arrayElement(['!', '@', '#', '$', '%', '^', '&', '*']);

  // 랜덤하게 섞기
  const raw = letters + number + special + faker.string.alpha({ length: 3 });
  return faker.helpers
    .shuffle([...raw])
    .join('')
    .slice(0, 12); // 길이는 적당히 자름
}
