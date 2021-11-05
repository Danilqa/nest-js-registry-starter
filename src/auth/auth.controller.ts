import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDataDto } from './dto/login-data-dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
    static ROOT_PATH = 'auth';

    constructor(private readonly authService: AuthService) {
    }

    @HttpCode(HttpStatus.OK)
    @Post('/validate')
    async verifyToken(@Body() data: TokenDto): Promise<void> {
        return this.authService.verifyToken(data);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Body() data: LoginDataDto): Promise<TokenDto> {
        return this.authService.login(data);
    }
}
