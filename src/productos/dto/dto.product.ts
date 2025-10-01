import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateProductDto {
    @IsNumber()
    loteNumber: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsDateString()
    entryDate: Date;
}
