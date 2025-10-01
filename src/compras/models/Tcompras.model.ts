import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ProductoCompra } from './TproductosCompras.model';
import { User } from 'src/auth/models/user.models';
import { Factura } from './TfacturacionCompra.model';
import { Product } from 'src/productos/models/product.model';

export interface ComprasCreationAttrs {
    clienteId: number;
    totalCompra: number;
}

@Table({ tableName: 'compras', timestamps: true })
export class Compra extends Model<Compra, ComprasCreationAttrs> {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    clienteId: number;

    @BelongsTo(() => User)
    cliente: User;

    @Column({ type: DataType.FLOAT, allowNull: true })
    totalCompra: number;

    @HasMany(() => ProductoCompra)
    productos: ProductoCompra[];

    @HasMany(() => Factura)
    factura: Factura[];
}
