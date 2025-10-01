import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Compra } from './Tcompras.model';
import { Product } from 'src/productos/models/product.model';

export interface ProductComprasCreationAttrs {
    compraId: number;
    productId: number;
    cantidad: number;
}

@Table({ tableName: 'productos_compras', timestamps: false })
export class ProductoCompra extends Model<ProductoCompra, ProductComprasCreationAttrs> {
    @ForeignKey(() => Compra)
    @Column({ type: DataType.INTEGER, allowNull: false })
    compraId: number;

    @BelongsTo(() => Compra)
    compra: Compra;

    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER, allowNull: false })
    productId: number;

    @BelongsTo(() => Product)
    product: Product;

    @Column({ type: DataType.INTEGER, allowNull: false })
    cantidad: number;
}