import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  resetToken: string;

  @ApiProperty({ example: 'newSecurePass123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}