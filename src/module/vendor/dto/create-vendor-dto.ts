import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShippingAndBillingAddressDto } from './address-dto';
import { partyContacts } from './party-contacts-dto';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVendorBodyDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  pan: string;

  @ApiPropertyOptional()
  tin: string;

  @ApiPropertyOptional()
  cstNumber: string;

  @ApiPropertyOptional()
  stNumber: string;

  @ApiPropertyOptional()
  gstNumber: string;

  @ApiPropertyOptional()
  @Transform((it) => {
    return Number.isNaN(it.value) || it.value == undefined || it.value === ''
      ? null
      : it.value;
  })
  purchaseExpiryPeriod: number;

  @ApiPropertyOptional({ type: 'enum', enum: ['1', '2'], default: '1' })
  @Transform((it) => {
    return it.value === true ? 1 : it.value === undefined ? 1 : 2;
  })
  acceptsCForm: string;
  // 1 - true , 2 -false
  @ApiPropertyOptional({ type: 'enum', enum: ['1', '2'], default: '1' })
  @Transform((it) => {
    return it.value === true ? 1 : it.value === undefined ? 1 : 2;
  })
  taxExempted: string;

  @ApiPropertyOptional({ type: 'enum', enum: ['1', '2'], default: '1' })
  @Transform((it) => {
    return it.value === true ? 1 : it.value === undefined ? 1 : 2;
  })
  enabled: string;

  @ApiPropertyOptional({ type: 'enum', enum: ['1', '2'], default: '1' })
  @Transform((it) => {
    return it.value === true ? 1 : it.value === undefined ? 1 : 2;
  })
  registeredDealer: string;
  @ApiProperty({ type: ShippingAndBillingAddressDto })
  @IsNotEmpty()
  shippingAddress: ShippingAndBillingAddressDto;

  @ApiProperty({ type: ShippingAndBillingAddressDto })
  @IsNotEmpty()
  billingAddress: ShippingAndBillingAddressDto;
  @ApiProperty({ type: [partyContacts] })
  partyContacts: partyContacts[];

  @ApiProperty()
  sameAsShipping: boolean;
}
