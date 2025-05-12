import { LoginDto } from '../../login/dtos/login.dto';

export interface ILoginService {
  login(dto: LoginDto): Promise<{ access_token: string; user_id: number }>;
}