import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // ---------------- REGISTER ----------------
  async register(data: any, role: 'patient' | 'doctor' | 'admin') {
    const { name, email, password } = data;

    const exists = await this.userModel.findOne({ email });
    if (exists) throw new BadRequestException('Email already used');

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashed,
      role,
    });

    return { message: `${role} registered`, user };
  }

  // ---------------- LOGIN ----------------
  async login(data: any, role: 'patient' | 'doctor' | 'admin') {
    const { email, password } = data;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.role !== role) {
      throw new UnauthorizedException(`This user is not a ${role}`);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid password');

    const token = this.jwtService.sign({
      id: user._id,
      role: user.role,
    });

    return { message: `${role} login successful`, token };
  }

  // ---------------- FORGOT PASSWORD ----------------
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Security best practice: don't reveal if email exists
      return { message: 'If email exists, reset link has been sent' };
    }

    // Generate reset token with 15min expiry
    const resetToken = this.jwtService.sign(
      { id: user._id },
      { expiresIn: '15m' },
    );

    // TODO: In production, send email with reset link
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // await this.emailService.sendPasswordReset(email, resetLink);

    return {
      message: 'Password reset token generated',
      resetToken, // Remove this in production! Only for testing
    };
  }

  // ---------------- RESET PASSWORD (NEW) ----------------
  async resetPassword(resetToken: string, newPassword: string) {
    try {
      // Verify the token
      const decoded = this.jwtService.verify(resetToken);
      
      // Find user by ID from token
      const user = await this.userModel.findById(decoded.id);
      if (!user) throw new BadRequestException('Invalid token');

      // Hash new password and save
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return { message: 'Password reset successful' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  // ---------------- CHANGE PASSWORD ----------------
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new UnauthorizedException('Old password is incorrect');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password changed successfully' };
  }

  // ---------------- LOGOUT ----------------
  async logout() {
    // JWT is stateless → logout handled on frontend
    return { message: 'Logout successful' };
  }

  // ---------------- GET USER ----------------
  async getUserById(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password');

    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}