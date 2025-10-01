import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Compra } from './models/Tcompras.model';
import { ProductoCompra } from './models/TproductosCompras.model';
import { Product } from 'src/productos/models/product.model';
import { CreateCompraDto } from './dtos/CreateCompras.dto';
import { Factura } from './models/TfacturacionCompra.model';

@Injectable()
export class ComprasService {
    constructor(
        @InjectModel(Compra) private compraModel: typeof Compra,
        @InjectModel(ProductoCompra) private productoCompraModel: typeof ProductoCompra,
        @InjectModel(Product) private productModel: typeof Product,
        @InjectModel(Factura) private FacturaModel: typeof Factura,
    ) { }

    async create(dto: CreateCompraDto, clienteId: number) {
        // Validar stock
        for (const item of dto.productos) {
            const product = await this.productModel.findByPk(item.productId);
            if (!product) throw new BadRequestException(`Producto ${item.productId} no existe`);
            if (product.quantity < item.cantidad) {
                throw new BadRequestException(`Stock insuficiente para ${product.name}`);
            }
        }
        console.log(clienteId);

        // Crear compra
        const compra = await this.compraModel.create({
            clienteId: clienteId,
            totalCompra: 0
        });

        // Crear productos de compra y actualizar stock
        for (const item of dto.productos) {
            await this.productoCompraModel.create({
                compraId: compra.id,
                productId: item.productId,
                cantidad: item.cantidad,
            });

            const product = await this.productModel.findByPk(item.productId);
            if (product) {
                await product.update({ quantity: product.quantity - item.cantidad });
            }

        }

        return {
            message: 'Compra realizada con éxito',
            compraId: compra.id,
        };
    }

    async findAllByUser(clienteId: number) {
        return this.compraModel.findAll({
            where: { clienteId },
            include: [
                {
                    model: ProductoCompra,
                    include: [{
                        model: this.productModel,
                        attributes: ['name', 'price'],
                    }],
                },
            ],
        });
    }

    async facturacion(id: number) {
        const compra = await this.compraModel.findByPk(id, { include: ['productos'] });
        if (!compra) throw new BadRequestException('Compra no encontrada');

        let total = 0;
        const productos = await this.productoCompraModel.findAll({ where: { compraId: compra.id } });

        for (const element of productos) {
            const producto = await this.productModel.findOne({
                where: { id: element.dataValues.productId },
            });
            if (producto) {
                const valorUnitario = producto.dataValues.price;
                const valorTotal = valorUnitario * element.dataValues.cantidad;
                total += valorTotal + (valorTotal * 0.19);

                await this.FacturaModel.create({
                    compraId: compra.id,
                    productId: element.dataValues.productId,
                    ValUnitario: valorUnitario,
                    ValTotal: valorTotal + (valorTotal * 0.19)
                });
            }
        }

        await compra.update({ totalCompra: total });

        return this.compraModel.findAll({
            where: { id },
            include: [
                {
                    model: Factura,
                    include: [{
                        model: this.productModel,
                        attributes: ['name', 'price'],
                    }],
                },
            ],
        });

    }
}

