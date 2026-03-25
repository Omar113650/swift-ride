import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Create User DTO
export class CreateUserDto {
  @ApiProperty({ example: 'Omar Elhelaly' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'omar@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(120)
  email: string;

  @ApiProperty({ example: '01095496184' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^01[0-9]{9}$/, { message: 'Phone must be a valid Egyptian number' })
  phone: string;

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
