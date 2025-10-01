import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { CreateUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    /**
 * @api {post} /auth/login iniciar sesion Usuario
 * @apiName iniciar sesion
 * @apiGroup Auth
 * 
 * @apiDescription Este endpoint inicia sesion en el sistema.
 * 
 * @apiBody {String} email Correo electrónico válido (único).
 * @apiBody {String{6..}} password Contraseña con mínimo 6 caracteres.
 * 
 * @apiSuccess {user} Users informacion del usuario logueado.
 * @apiSuccess {token} Tokens token de acceso del usuario expira en 1h.
 * 
 * @apiError Error credenciales no validas.
 * 
 *  */
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return await this.authService.login(dto);
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refreshToken(@Request() req) {
        return await this.authService.refreshToken(req);
    }

    /**
 * @api {post} /auth/register Registrar Usuario
 * @apiName RegisterUser
 * @apiGroup Auth
 *
 * @apiDescription Este endpoint crea un nuevo usuario en el sistema.
 * Antes de registrar al usuario, el sistema valida que el correo electrónico no exista previamente.
 *
 * @apiBody {String} fullName Nombre completo del usuario.
 * @apiBody {String} email Correo electrónico válido (único).
 * @apiBody {String{6..}} password Contraseña con mínimo 6 caracteres.
 * @apiBody {String="ADMIN","USER"} role Rol del usuario en el sistema.
 * @apiBody {Number} phone Número de teléfono (solo números).
 * @apiBody {String} address Dirección de residencia.
 * @apiBody {String} city Ciudad de residencia.
 *
 * @apiSuccess {Number} id ID del usuario creado.
 * @apiSuccess {String} email Email del usuario.
 * @apiSuccess {String} rol Rol asignado.
 * 
 * @apiError Error Usuario Existente El correo electrónico ya está registrado en el sistema.
 */
    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        return await this.authService.register(dto);
    }
}
