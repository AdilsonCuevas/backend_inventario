import { Module } from '@nestjs/common';
import { Product } from './models/product.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { JwtService } from '@nestjs/jwt';
import { Compra } from 'src/compras/models/Tcompras.model';
import { User } from 'src/auth/models/user.models';
import { ProductoCompra } from 'src/compras/models/TproductosCompras.model';

@Module({
    imports: [SequelizeModule.forFeature([Product, Compra, User, ProductoCompra])],
    controllers: [ProductosController],
    providers: [ProductosService, JwtService]
})
export class ProductosModule { }
