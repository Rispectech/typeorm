import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class VendorCatalogBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  vendorCode: string;

  @ApiProperty()
  itemTypeSkuCode: string;

  @ApiProperty()
  vendorSkuCode: string;

  @ApiProperty({ default: 0 })
  inventory: number;

  @ApiProperty({ default: 1.0, type: 'float' })
  @Transform((it) => parseFloat(it.value))
  unitPrice: number;

  @ApiProperty({ default: 1 })
  priority: number;

  @ApiProperty({ type: 'enum', default: '1', enum: ['0', '1'] })
  enabled: string;
}
