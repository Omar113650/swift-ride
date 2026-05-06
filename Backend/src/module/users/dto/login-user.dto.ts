import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// login User DTO
export class LoginDto {
  @ApiProperty({ example: 'omar@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(120)
  email: string;

  @ApiProperty({ example: 'Omar@669696' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Password must include upper, lower, number and special character',
  })
  password: string;
}
