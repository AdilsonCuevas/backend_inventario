import { Table, Column, Model, DataType } from 'sequelize-typescript';

export interface ProductCreationAttrs {
    loteNumber: number;
    name: string;
    price: number;
    quantity: number;
    entryDate: Date;
}

@Table({ tableName: 'products', timestamps: true })
export class Product extends Model<Product, ProductCreationAttrs> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    loteNumber: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    price: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    entryDate: Date;
}
