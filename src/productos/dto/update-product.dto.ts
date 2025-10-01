import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './dto.product';

export class UpdateProductDto extends PartialType(CreateProductDto) { }
