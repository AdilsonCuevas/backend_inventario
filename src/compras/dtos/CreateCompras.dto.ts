import { IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CompraProductoDto {
    @IsNumber()
    productId: number;

    @IsNumber()
    @Min(1)
    cantidad: number;
}

export class CreateCompraDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CompraProductoDto)
    productos: CompraProductoDto[];
}
