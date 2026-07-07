import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private AuthService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Daftar akun dokter/admin baru' })
    register(@Body() dto: RegisterDto) {
        return this.AuthService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login dan dapatkan JWT token' })
    login(@Body() dto: LoginDto) {
        return this.AuthService.login(dto);
    }
}
