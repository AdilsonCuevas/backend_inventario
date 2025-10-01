import { IsString, IsEmail, MinLength, IsEnum, IsNumber } from 'class-validator';
import { UserRole } from '../models/user.models';


export class CreateUserDto {
    @IsString()
    fullName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsNumber({}, { message: 'El teléfono solo puede contener números' })
    phone: number;

    @IsString()
    address: string;

    @IsString()
    city: string;
}