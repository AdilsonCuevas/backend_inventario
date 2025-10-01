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

    /**
 * @api {post} /productos crear un nuevo producto
 * @apiName Registro de productos
 * @apiGroup Productos
 * 
 * @apiDescription crea productos desde el rol de usuarios administrador.
 * 
 * @apiBody {number} loteNumber referencia del producto 
 * @apiBody {string} name nombre o descripcion del producto
 * @apiBody {number} price precio unitario del producto
 * @apiBody {number} quantity cantidad del producto en stock
 * @apiBody {date} entryDate fecha de entrada del producto
 * 
 * @apiSuccess Response mensaje de confirmacion de creacion del producto 
 * 
 * @apiError DTO los campos no son los indicados
 * @apiError Autenticate no hay un usario autenticado 
 * @apiError errorRol rol {}
 * 
 * */
    @Post()
    @Roles('ADMIN')
    async CreateProduct(@Body() dto: CreateProductDto) {
        return await this.productsService.create(dto);
    }

    /**
 * @api {get} /productos/views views
 * @apiName views de pedidos
 * @apiGroup Productos
 * 
 * @apiDescription visualiza los pedidos realiados de los clientes en administrador.
 * 
 * @apiSuccess Response archivo json con la informacion
 * 
 * @apiError Autenticate no hay un usario autenticado 
 * @apiError errorRol rol {}
 * */
    @Get('views')
    @Roles('ADMIN')
    views() {
        return this.productsService.views();
    }

    /**
 * @api {get} /productos listar 
 * @apiName lstar productos
 * @apiGroup Productos
 * 
 * @apiDescription visualizacion de todos los productos creados en un archivo json
 * 
 * @apiSuccess Response archivo json con la informacion
 * 
 * @apiError Autenticate no hay un usario autenticado 
 * @apiError errorRol rol {}
 * */
    @Get()
    @Roles('ADMIN')
    findAll() {
        return this.productsService.findAll();
    }

    /**
 * @api {get} /productos/:id visualizar
 * @apiName visualizar producto
 * @apiGroup Productos
 * 
 * @apiDescription visualizacion de un solo producto en un archivo json
 * 
 * @apiSuccess Response archivo json con la informacion
 * 
 * @apiError Autenticate no hay un usario autenticado 
 * @apiError errorRol rol {}
 * */
    @Get(':id')
    @Roles('ADMIN')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    /**
 * @api {put} /productos/:id editar
 * @apiName editar producto
 * @apiGroup Productos
 * 
 * @apiDescription envio informacion del producto con sus actulizacion
 * 
 * @apiBody Request datos actualizados teniendo en cuenta los mismos de la api create
 * 
 * @apiSuccess Response mensaje de confirmacion
 * 
 * @apiError Autenticate no hay un usario autenticado 
 * @apiError errorRol rol {}
 * */
    @Put(':id')
    @Roles('ADMIN')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, dto);
    }

    /**
 * @api {delete} /productos/:id eliminar
 * @apiName eliminar producto
 * @apiGroup Productos
 * 
 * @apiDescription peticion para que se elimine un producto en especifico
 * 
 * @apiSuccess Response mensaje de confirmacion
 * 
 * @apiError Autenticate no hay un usario autenticado 
 * @apiError errorRol rol {}
 * */
    @Delete(':id')
    @Roles('ADMIN')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }

}
