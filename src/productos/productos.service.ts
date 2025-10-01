import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { CreateProductDto } from './dto/dto.product';
import { UpdateProductDto } from './dto/update-product.dto';
import { Compra } from 'src/compras/models/Tcompras.model';
import { User } from 'src/auth/models/user.models';
import { ProductoCompra } from 'src/compras/models/TproductosCompras.model';
import { groupBy } from 'lodash';

@Injectable()
export class ProductosService {

    constructor(
        @InjectModel(Product)
        private ProductModel: typeof Product,

        @InjectModel(Compra)
        private compraModel: typeof Compra,

        @InjectModel(User)
        private userModel: typeof User,

        @InjectModel(ProductoCompra)
        private productoCompra: typeof ProductoCompra,
    ) { }

    async create(dto: CreateProductDto): Promise<Product> {
        return await this.ProductModel.create({ ...dto, });
    }

    async findAll(): Promise<Product[]> {
        return this.ProductModel.findAll();
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.ProductModel.findByPk(id);
        if (!product) throw new NotFoundException('Producto no encontrado');
        return product;
    }

    async update(id: number, dto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);
        return product.update(dto);
    }

    async remove(id: number): Promise<void> {
        const product = await this.findOne(id);
        await product.destroy();
    }

    async views() {
        const compras = await this.compraModel.findAll({
            attributes: ['id', 'totalCompra', 'createdAt'],
            include: [{
                model: this.userModel,
                attributes: ['fullName', 'email'],
            },
            {
                model: this.productoCompra,
                attributes: ['cantidad'],
                include: [
                    {
                        model: this.ProductModel,
                        attributes: ['name', 'price'],
                    },
                ],
            },
            ],
            raw: true,
            nest: true,
        });

        const response: any[] = [];

        const comprasRaw = Object.values(groupBy(compras, 'id')).map((items: any[]) => {
            const { id, totalCompra, createdAt, cliente } = items[0];
            const productos = items.map(i => ({
                cantidad: i.productos.cantidad,
                name: i.productos.product.name,
                price: i.productos.product.price,
            }));
            response.push({
                id,
                totalCompra,
                createdAt,
                cliente,
                productos,
            });
        });

        return response;
    }
}
