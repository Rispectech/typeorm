import { Entity, Enum, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../global/entity/base.entity';
import {
  IsAdvanceEnum,
  PaymentCategoryEnum,
  VendorEnum,
} from '../vendor.constant';
import { STATUS } from '../../../global/global.constant';

@Entity({
  tableName: 'vendor',
})
export class Vendor extends BaseEntity {
  @Property()
  code: string;
  @Property({ length: 100 })
  name: string;
  @Property({ nullable: true, default: null })
  pan: string;
  @Property({ nullable: true, default: null })
  tin: string;
  @Property({ nullable: true, default: null })
  cstNumber: string;
  @Property({ nullable: true, default: null })
  stNumber: string;
  @Property({ nullable: true, default: null })
  gstNumber: string;
  @Property({ nullable: true, default: null })
  purchaseExpiryPeriod: number;
  @Enum({
    items: () => VendorEnum,
    nullable: true,
    default: VendorEnum.TRUE,
  })
  acceptsCForm: string;
  @Enum({
    items: () => VendorEnum,
    nullable: true,
    default: VendorEnum.TRUE,
  })
  taxExempted: string;
  @Enum({
    items: () => VendorEnum,
    nullable: true,
    default: VendorEnum.TRUE,
  })
  enabled: string;
  @Enum({
    items: () => VendorEnum,
    nullable: true,
    default: VendorEnum.TRUE,
  })
  registeredDealer: string;

  @Property()
  contact_name: string;
  @Property()
  email: string;
  @Property()
  mobile: string;
  @Enum({ items: () => STATUS, default: STATUS.ACTIVE, nullable: true })
  status: string;
  @Property()
  updated_by: number;
  @Property()
  created_by: number;

  @Property({ default: null, nullable: true })
  payment_cycle: number;

  @Property()
  billingAddressId: number;

  @Property()
  shippingAddressId: number;

  @Enum({ items: () => IsAdvanceEnum, default: IsAdvanceEnum.FALSE })
  is_advance: string;

  @Enum({ items: () => PaymentCategoryEnum, default: null })
  payment_category: string;

  @Property({ nullable: true, default: null })
  payment_category_details: string;
}
