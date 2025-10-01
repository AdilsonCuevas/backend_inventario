import { ConflictException, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.models';
import { CreateUserDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,

        @InjectModel(User)
        private userModel: typeof User,
    ) { }


    async register(dto: CreateUserDto) {
        const existing = await this.userModel.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email ya registrado');

        try {
            const hashPass = await bcrypt.hash(dto.password, 10);

            const user = await this.userModel.create({
                ...dto,
                password: hashPass,
            });

            const payload = { sub: user.id, email: user.email, role: user.role, name: user.fullName };

            return {
                user,
                tokens: {
                    accessToken: await this.jwtService.signAsync(payload, {
                        expiresIn: '1h',
                        secret:
                            this.configService.get('JWT_SECRET'),
                    }),
                    refreshToken: await this.jwtService.signAsync(payload, {
                        expiresIn: '7h',
                        secret:
                            this.configService.get('JWT_REFRESH'),
                    }),
                },
            };
        } catch (error) {
            throw new BadRequestException("Error registro de usuario " + error.message);
        };
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto);

        const payload = { sub: user.id, email: user.email, role: user.role, name: user.fullName };

        return {
            user,
            tokens: {
                accessToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '1h',
                    secret:
                        this.configService.get('JWT_SECRET'),
                }),
                refreshToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '7h',
                    secret:
                        this.configService.get('JWT_REFRESH'),
                }),
            },
        };
    }

    async refreshToken(user: any) {
        const payload = {
            username: user.username,
            sub: {
                Lastname: user.sub,
            },
        };

        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '20s',
                    secret:
                        this.configService.get('JWT_SECRET'),
                }),
                refreshToken: await this.jwtService.signAsync(payload, {
                    expiresIn: '7h',
                    secret:
                        this.configService.get('JWT_SECRET'),
                }),
            },
        };
    }

    async validateUser(dto: LoginDto) {
        const user = await this.findByEmail(dto.email);
        if (user && (await compare(dto.password, user.getDataValue('password')))) {
            const { password, ...result } = user.dataValues;
            return result;
        }
        throw new UnauthorizedException();
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({
            where: {
                email: email,
            },
        });
    }
}
