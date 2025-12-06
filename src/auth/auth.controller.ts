import { Controller,Post,Body,Get,Req,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { RoleGuard } from './role/role.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  // Protected route
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in user (Requires Bearer Token)' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  // Admin-only Route
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin test route (Only Admin can access)' })
  @UseGuards(JwtAuthGuard, new RoleGuard(['admin']))
  @Get('admin-test')
  adminCheck() {
    return { message: 'Admin access granted' };
  }
}
