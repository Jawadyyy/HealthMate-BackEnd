import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';
import { ForgotPasswordDto } from './dto//forgot-pass.dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-pass.dto/change-password.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorator/roles_decorator';
import { ResetPasswordDto } from './dto/reset-pass.dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ---------------- REGISTER ----------------
  @Post('register/patient')
  registerPatient(@Body() body: RegisterDto) {
    return this.authService.register(body, 'patient');
  }

  @Post('register/doctor')
  registerDoctor(@Body() body: RegisterDto) {
    return this.authService.register(body, 'doctor');
  }

  @Post('register/admin')
  registerAdmin(@Body() body: RegisterDto) {
    return this.authService.register(body, 'admin');
  }

  // ---------------- LOGIN ----------------
  @Post('login/patient')
  loginPatient(@Body() body: LoginDto) {
    return this.authService.login(body, 'patient');
  }

  @Post('login/doctor')
  loginDoctor(@Body() body: LoginDto) {
    return this.authService.login(body, 'doctor');
  }

  @Post('login/admin')
  loginAdmin(@Body() body: LoginDto) {
    return this.authService.login(body, 'admin');
  }

  // ---------------- FORGOT PASSWORD ----------------
  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  // ---------------- RESET PASSWORD (NEW) ----------------
  @ApiOperation({ summary: 'Reset password using token' })
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.resetToken, body.newPassword);
  }

  // ---------------- CHANGE PASSWORD ----------------
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @Req() req,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.id,
      body.oldPassword,
      body.newPassword,
    );
  }

  // ---------------- LOGOUT ----------------
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  logout() {
    return this.authService.logout();
  }

  // ---------------- PROFILE ----------------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    const user = await this.authService.getUserById(req.user.id);
    return { success: true, data: user };
  }
}