import { Table, Column, Model, DataType } from 'sequelize-typescript';

export enum UserRole {
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
}

export interface UserCreationAttrs {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    phone: number;
    address: string;
    city: string;
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User, UserCreationAttrs> {

    @Column({ type: DataType.STRING, allowNull: false })
    fullName: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @Column({ type: DataType.ENUM(...Object.values(UserRole)), allowNull: false, defaultValue: UserRole.CLIENT })
    role: UserRole;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    phone: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    address: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    city: string;
}
