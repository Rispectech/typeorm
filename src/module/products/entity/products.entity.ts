import { Entity, Enum, Property } from '@mikro-orm/core';
import { ProductsStatus } from '../product.constant';
import { BaseEntity } from '../../../global/entity/base.entity';

@Entity({
  tableName: 'products',
})
export class Products extends BaseEntity {
  @Property({ type: 'text' })
  name: string;

  @Property({ default: null, nullable: true, type: 'text' })
  hindi_name: string;

  @Property({ type: 'int', length: 11, default: 0 })
  strike_price: number;

  @Property({ type: 'int', length: 11, default: 0 })
  price: number;

  @Property({ nullable: true, length: 256, default: null })
  nickname: string;

  @Property({ nullable: true, length: 356, default: null })
  hindi_nickname: string;

  @Property({
    nullable: true,
    type: 'float',
    scale: 2,
    precision: 11,
    default: null,
  })
  length: number;

  @Property({
    nullable: true,
    type: 'float',
    scale: 2,
    precision: 11,
    default: null,
  })
  breadth: number;

  @Property({
    nullable: true,
    type: 'float',
    scale: 2,
    precision: 11,
    default: null,
  })
  height: number;

  @Property({
    nullable: true,
    type: 'float',
    scale: 2,
    precision: 11,
    default: null,
  })
  weight: string;

  @Property({ nullable: true, length: 45 })
  sku_code: string;

  @Property({ type: 'double', nullable: true, default: 0 })
  gst_slab: number;

  @Enum({
    type: 'enum',
    default: ProductsStatus.ACTIVE,
    items: () => ProductsStatus,
  })
  status: string;

  @Property({ type: 'int', length: 11 })
  updated_by: number;

  @Property({ type: 'int', length: 11 })
  created_by: number;
}
