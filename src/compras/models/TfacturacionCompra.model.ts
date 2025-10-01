import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Compra } from './Tcompras.model';
import { Product } from 'src/productos/models/product.model';

export interface facturacionCreationAttrs {
    compraId: number;
    productId: number;
    ValUnitario: number;
    ValTotal: number,
}

@Table({ tableName: 'facturas', timestamps: true })
export class Factura extends Model<Factura, facturacionCreationAttrs> {

    @ForeignKey(() => Compra)
    @Column({ type: DataType.INTEGER })
    compraId: number;

    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER, allowNull: false })
    productId: number;

    @BelongsTo(() => Product)
    product: Product;

    @Column({ type: DataType.FLOAT })
    ValUnitario: number;

    @Column({ type: DataType.FLOAT })
    ValTotal: number;
}
