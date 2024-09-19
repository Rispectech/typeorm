import { Entity, Enum, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../global/entity/base.entity';

enum Status {
  Active = 1,
  NonActive = 0,
}
@Entity({
  tableName: 'user',
})
export class User extends BaseEntity {
  @Property()
  full_name: string;

  @Property({ default: null, nullable: true })
  email: string;

  @Property()
  password: string;

  @Enum({
    items: () => Status,
    array: true,
    default: [Status.Active],
    nullable: true,
  })
  status: string;
}
