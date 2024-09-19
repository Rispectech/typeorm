import { Entity, Enum, Property } from '@mikro-orm/core';
import { STATUS } from '../../../global/global.constant';
import { BaseEntity } from '../../../global/entity/base.entity';

@Entity({
  tableName: 'mapped_products',
})
export class MappedProducts extends BaseEntity {
  @Property()
  product_id: string;

  @Property()
  sku_code: string;

  @Property()
  mapped_product_id: number;

  @Property()
  mapped_sku_code: string;

  @Property({ nullable: true, default: 0 })
  mapped_quantity: number;

  @Enum({ type: 'string', default: STATUS.ACTIVE, items: () => STATUS })
  status: string;

  @Property()
  updated_by: number;

  @Property()
  created_by: number;
}
