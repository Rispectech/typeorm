import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorsModule } from '../vendor/vendor.module';
import { UtilModule } from '../util/util.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from 'src/database/MikroOrm/database.module';

@Module({
  imports: [DatabaseModule, VendorsModule, UtilModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
