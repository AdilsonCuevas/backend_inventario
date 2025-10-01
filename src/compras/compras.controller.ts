import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dtos/CreateCompras.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/guards/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('compras')
@UseGuards(JwtGuard, RolesGuard)
export class ComprasController {
    constructor(private readonly comprasService: ComprasService) { }

    /**
 * @api {post} /compras crear una compra
 * @apiName crear una compra
 * @apiGroup compras
 * 
 * @apiDescription crea crea un compa con el rol cliente.
 * 
  *    @apiBody {number} productId id del producto,
  *    @apiBody {number} cantidad del producto
  *    @apiBody los anterior datos debe estar en un array puede agregar multiples datos para crear su pedido
 * 
 * @apiSuccess Response mensaje de confirmacion de creacion del producto 
 * 
 * @apiError DTO los campos no son los indicados
 * @apiError Autenticate no hay un usario autenticado 
 * @apiError errorRol rol {}
 * 
 * */
    @Post()
    @Roles('CLIENT')
    create(@Body() dto: CreateCompraDto, @Request() req) {
        const clienteId = req.user.sub;
        return this.comprasService.create(dto, clienteId);
    }

    /**
 * @api {get} /compras/mis-compras views
 * @apiName views de compras
 * @apiGroup compras
 * 
 * @apiDescription visualiza en un archivo json todas las compras realizadas por el cliente.
 * 
 * @apiSuccess Response archivo json con la informacion
 * 
 * @apiError Autenticate no hay un usario autenticado 
 * @apiError errorRol rol {}
 * */
    @Get('mis-compras')
    @Roles('CLIENT')
    findMyPurchases(@Request() req) {
        const clienteId = req.user.sub;
        return this.comprasService.findAllByUser(clienteId);
    }

    /**
 * @api {get} /compras/:id facturacion
 * @apiName facturacion
 * @apiGroup compras
 * 
 * @apiDescription factura la compra realizadas por el cliente.
 * 
 * @apiSuccess Response archivo json con la informacion
 * 
 * @apiError Autenticate no hay un usario autenticado 
 * @apiError errorRol rol {}
 * */
    @Get(':id')
    @Roles('CLIENT')
    facturar(@Param('id', ParseIntPipe) id: number) {
        return this.comprasService.facturacion(id);
    }
}
