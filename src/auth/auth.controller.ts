import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto/register.dto';
import { LoginDto } from './dto/login.dto/login.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorator/roles_decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ---------------------- REGISTRATION ----------------------
  @ApiOperation({ summary: 'Register a new patient' })
  @Post('register/patient')
  registerPatient(@Body() body: RegisterDto) {
    return this.authService.register(body, 'patient');
  }

  @ApiOperation({ summary: 'Register a new doctor' })
  @Post('register/doctor')
  registerDoctor(@Body() body: RegisterDto) {
    return this.authService.register(body, 'doctor');
  }

  @ApiOperation({ summary: 'Register a new admin' })
  @Post('register/admin')
  registerAdmin(@Body() body: RegisterDto) {
    return this.authService.register(body, 'admin');
  }

  // ---------------------- LOGIN ----------------------
  @ApiOperation({ summary: 'Patient login' })
  @Post('login/patient')
  loginPatient(@Body() body: LoginDto) {
    return this.authService.login(body, 'patient');
  }

  @ApiOperation({ summary: 'Doctor login' })
  @Post('login/doctor')
  loginDoctor(@Body() body: LoginDto) {
    return this.authService.login(body, 'doctor');
  }

  @ApiOperation({ summary: 'Admin login' })
  @Post('login/admin')
  loginAdmin(@Body() body: LoginDto) {
    return this.authService.login(body, 'admin');
  }

  // ---------------------- PROFILE ----------------------
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in user' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    // Get full user details from database instead of just JWT payload
    const user = await this.authService.getUserById(req.user.id);
    return {
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  // ---------------------- ROLE TEST ROUTES ----------------------
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin-only route' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-test')
  adminCheck() {
    return { message: 'Admin access granted' };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Doctor-only route' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  @Get('doctor-test')
  doctorCheck() {
    return { message: 'Doctor access granted' };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Patient-only route' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('patient')
  @Get('patient-test')
  patientCheck() {
    return { message: 'Patient access granted' };
  }
}