import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { ProductosModule } from './productos/productos.module';
import { User } from './auth/models/user.models';
import { Product } from './productos/models/product.model';
import { ComprasModule } from './compras/compras.module';
import { Compra } from './compras/models/Tcompras.model';
import { Factura } from './compras/models/TfacturacionCompra.model';
import { ProductoCompra } from './compras/models/TproductosCompras.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: config.get('DB_TYPE'),
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '3306', 10),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        models: [User, Product, Compra, Factura, ProductoCompra],
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      })
    }),
    AuthModule,
    ProductosModule,
    ComprasModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
