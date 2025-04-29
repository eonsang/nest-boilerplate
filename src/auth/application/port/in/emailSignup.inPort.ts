import { Result } from 'neverthrow';
import { AuthError } from '../../error';

export class EmailSignupDto {
  password: string;
  email: string;
}

export interface EmailSignupInPort {
  execute(body: EmailSignupDto): Promise<Result<boolean, AuthError>>;
}
