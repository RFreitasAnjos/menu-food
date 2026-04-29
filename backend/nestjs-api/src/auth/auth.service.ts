import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto, requiredRole?: UserRole) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (!user || !user.password) throw new UnauthorizedException('Credenciais inválidas');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Credenciais inválidas');

    if (requiredRole && user.role !== requiredRole) {
      throw new ForbiddenException('Acesso negado para esse tipo de usuário');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  async refresh(refreshTokenValue: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenValue, revoked: false },
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    const user = await this.userRepository.findOne({ where: { id: token.userId } });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  }

  async revoke(refreshTokenValue: string) {
    await this.refreshTokenRepository.update(
      { token: refreshTokenValue },
      { revoked: true },
    );
  }

  private generateAccessToken(user: User): string {
    const expiresIn = this.config.get('JWT_EXPIRATION', '15m');
    return this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn },
    );
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const expirationDays = this.config.get<number>('JWT_REFRESH_EXPIRATION_DAYS', 7);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(expirationDays));

    const token = uuidv4();
    await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({ token, userId, expiresAt, revoked: false }),
    );
    return token;
  }
}
