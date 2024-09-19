import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ShippingAndBillingAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({ default: null })
  addressLine2: string;

  @ApiProperty()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty()
  @IsNotEmpty()
  pincode: number;

  @ApiProperty()
  @IsNotEmpty()
  stateCode: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;
}
