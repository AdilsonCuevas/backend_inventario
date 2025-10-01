import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ProductosService } from './productos.service';
import { CreateProductDto } from './dto/dto.product';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/auth/guards/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('productos')
@UseGuards(JwtGuard, RolesGuard)
export class ProductosController {

    constructor(private readonly productsService: ProductosService) { }

    @Post()
    @Roles('ADMIN')
    async CreateProduct(@Body() dto: CreateProductDto) {
        return await this.productsService.create(dto);
    }

    @Get('views')
    @Roles('ADMIN')
    views() {
        return this.productsService.views();
    }

    @Get()
    @Roles('ADMIN')
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    @Roles('ADMIN')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    @Put(':id')
    @Roles('ADMIN')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, dto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }

}
