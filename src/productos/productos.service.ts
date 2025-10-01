import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { CreateProductDto } from './dto/dto.product';
import { UpdateProductDto } from './dto/update-product.dto';
import { Compra } from 'src/compras/models/Tcompras.model';
import { User } from 'src/auth/models/user.models';

@Injectable()
export class ProductosService {

    constructor(
        @InjectModel(Product)
        private ProductModel: typeof Product,

        @InjectModel(Compra)
        private compraModel: typeof Compra,

        @InjectModel(User)
        private userModel: typeof User,

        @InjectModel(User)
        private ProductoCompra: typeof User,
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
        console.log("enrea aqui");
        const compras = await this.compraModel.findAll({
            attributes: ['id', 'totalCompra', 'createdAt'],
            include: [{
                model: this.userModel,
                attributes: ['fullName', 'email'],
            },
            {
                model: this.ProductoCompra,
                attributes: ['cantidad'],
                include: [
                    {
                        model: this.ProductModel,
                        attributes: ['name', 'price'],
                    },
                ],
            },
            ]
        });

        return compras.map(compra => ({
            fechaCompra: compra.createdAt,
            totalCompra: compra.totalCompra,
            cliente: {
                nombre: compra.cliente.fullName,
                email: compra.cliente.email,
            },
            productos: compra.productos.map(pc => ({
                nombre: pc.product.name,
                cantidad: pc.cantidad,
                precioUnitario: pc.product.price,
            })),
        }));
    }
}
