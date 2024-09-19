import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DATABASE_INSTANCE } from 'src/config/database/database.constants';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Config, MySqlDriver } from '@mikro-orm/mysql';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   cache: true,
    //   validate,
    //   isGlobal: true,
    //   load: [configurations],
    // }),
    // MikroOrmModule.forRootAsync({
    //   contextName: DATABASE_INSTANCE.MASTER,
    //   useFactory: () => {
    //     const dbConfig = configurations();
    //     return dbConfig;
    //   },
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot({
      contextName: DATABASE_INSTANCE.MASTER,
      metadataProvider: TsMorphMetadataProvider,
      driver: MySqlDriver,
      // type: 'mysql',
      charset: 'utf8mb4',
      port: 3306,
      host: 'localhost',
      password: 'rishabh@132001',
      dbName: 'TypeORM-mikro-orm',
      entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
    }),
  ],
})
export class DatabaseModule {}
