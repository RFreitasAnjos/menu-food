import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login do cliente' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.doLogin(dto, UserRole.CLIENT, res);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login exclusivo para administradores' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async adminLogin(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.doLogin(dto, UserRole.ADMIN, res);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token via refresh token (cookie)' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenValue = req.cookies?.['refresh_token'];
    if (!refreshTokenValue) throw new UnauthorizedException('Refresh token ausente');

    const { accessToken } = await this.authService.refresh(refreshTokenValue);
    this.setAccessCookie(res, accessToken);
    return { message: 'Token renovado com sucesso' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Encerrar sessão' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenValue = req.cookies?.['refresh_token'];
    if (refreshTokenValue) await this.authService.revoke(refreshTokenValue);

    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/api/v1/auth' });
    return { message: 'Logout realizado com sucesso' };
  }

  private async doLogin(
    dto: LoginDto,
    requiredRole: UserRole,
    res: Response,
  ): Promise<AuthResponseDto> {
    const { user, accessToken, refreshToken } = await this.authService.login(dto, requiredRole);

    this.setAccessCookie(res, accessToken);

    const refreshDays = this.config.get<number>('JWT_REFRESH_EXPIRATION_DAYS', 7);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: Number(refreshDays) * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private setAccessCookie(res: Response, accessToken: string) {
    const expirationMs = 15 * 60 * 1000; // 15 min
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: expirationMs,
    });
  }
}
