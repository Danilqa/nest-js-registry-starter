import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDataDto } from './dto/login-data-dto';
import { TokenDto } from './dto/token.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    static ROOT_PATH = 'auth';

    constructor(private readonly authService: AuthService) {
    }

    @ApiBearerAuth('access-token')
    @ApiBody({ type: TokenDto })
    @HttpCode(HttpStatus.OK)
    @Post('/validate')
    async verifyToken(@Headers('authorization') authorization: string): Promise<void> {
        return this.authService.verifyToken(authorization);
    }

    @ApiBody({ type: LoginDataDto })
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Body() data: LoginDataDto): Promise<TokenDto> {
        return this.authService.login(data);
    }
}
