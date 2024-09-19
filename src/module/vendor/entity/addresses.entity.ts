import { BaseEntity } from '../../../global/entity/base.entity';
import { STATUS } from '../../../global/global.constant';
import { Entity, Enum, Property } from '@mikro-orm/core';

@Entity({
  tableName: 'vendor_addresses',
})
export class Addresses extends BaseEntity {
  @Property()
  addressLine1: string;

  @Property({ default: null, nullable: true })
  addressLine2: string;

  @Property()
  countryCode: string;

  @Property()
  pincode: number;

  @Property()
  stateCode: string;

  @Property()
  city: string;

  @Property()
  phone: string;

  @Enum({
    items: () => STATUS,
    default: [STATUS.ACTIVE],
    array: true,
    nullable: true,
  })
  status: STATUS;

  @Property()
  updated_by: number;
  @Property()
  created_by: number;
}
