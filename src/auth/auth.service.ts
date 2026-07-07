import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.userService.findByEmail(dto.email);
        if (existing) throw new Error('Email sudah digunakan');

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.userService.create({
            nama: dto.nama,
            email: dto.email,
            password: hashedPassword,
            role: dto.role ?? 'DOKTER',
        });
        return {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role,
        };
      
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Email atau password salah');

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Email atau password salah');

        const payload = { sub: user.id, email: user.email, role: user.role };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role,
            },
        };
    }
}
