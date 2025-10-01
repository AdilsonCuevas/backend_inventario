import { Module } from '@nestjs/common';
import { ComprasController } from './compras.controller';
import { ComprasService } from './compras.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Compra } from './models/Tcompras.model';
import { ProductoCompra } from './models/TproductosCompras.model';
import { Product } from 'src/productos/models/product.model';
import { JwtService } from '@nestjs/jwt';
import { Factura } from './models/TfacturacionCompra.model';

@Module({
  imports: [SequelizeModule.forFeature([Compra, ProductoCompra, Product, Factura])],
  controllers: [ComprasController],
  providers: [ComprasService, JwtService]
})
export class ComprasModule { }
