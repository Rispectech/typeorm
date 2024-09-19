import { Entity, Enum, Property } from '@mikro-orm/core';

import { BaseEntity } from '../../../global/entity/base.entity';
import { STATUS } from '../../../global/global.constant';

@Entity({
  tableName: 'vendor_catalog',
})
export class VendorCatalog extends BaseEntity {
  @Property()
  vendor_id: number;

  @Property()
  product_id: number;

  @Property()
  product_name: string;

  @Property()
  product_sku_code: string;

  @Property({ type: 'float', default: 0.0, scale: 2, precision: 10 })
  unit_price: number;

  @Enum({ items: () => STATUS, nullable: true })
  status: STATUS;

  @Property()
  updated_by: number;

  @Property()
  created_by: number;
}
