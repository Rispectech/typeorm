
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorSerivce } from './vendor.service';
import { AuthMiddleware } from '../../helper/middleware/user-authorization';
import { Vendor } from './entity/vendor.entity';
import { Addresses } from './entity/addresses.entity';
import { DATABASE_INSTANCE } from 'src/config/database/database.constants';
import { Products } from '../products/entity/products.entity';
import { VendorCatalog } from './entity/vendor-catalog.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forFeature(
      [Vendor, Addresses, Products, VendorCatalog],
      DATABASE_INSTANCE.MASTER,
    ),
  ],
  controllers: [VendorController],
  providers: [VendorSerivce],
})
export class VendorsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes(VendorController);
  }
}
