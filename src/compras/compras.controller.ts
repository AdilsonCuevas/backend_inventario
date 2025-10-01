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

    @Post()
    @Roles('CLIENT')
    create(@Body() dto: CreateCompraDto, @Request() req) {
        const clienteId = req.user.sub;
        return this.comprasService.create(dto, clienteId);
    }

    @Get('mis-compras')
    @Roles('CLIENT')
    findMyPurchases(@Request() req) {
        const clienteId = req.user.sub;
        return this.comprasService.findAllByUser(clienteId);
    }

    @Get(':id')
    @Roles('CLIENT')
    facturar(@Param('id', ParseIntPipe) id: number) {
        return this.comprasService.facturacion(id);
    }
}
