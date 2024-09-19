import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';

import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

// import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import responseTime from 'response-time';
import * as process from 'process';
import * as bodyParser from 'body-parser';
import { LoggingInterceptor } from './helper/interceptor/request-logging';
import { ResponseTransformInterceptor } from './helper/interceptor/request-transformation';
import { AllExceptionsFilter } from './helper/filter/exception-filter';
import { ConfigService } from '@nestjs/config';
import {
  AppEnvironment,
  AppPort,
  EnvVariable,
  SWAGGER_DOCUMENTATION_PATH,
} from './config/env/env.constants';

process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const configService = app.get(ConfigService);
  const appEnvironment = configService.get(EnvVariable.NODE_ENV);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(responseTime());

  app.use(bodyParser.json({ limit: '50mb' }));

  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseTransformInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('TypeORM Api Documentation')
    .setDescription('TypeORM Backend Apis Written in Nest.js')
    .setVersion('1.0')
    .addBearerAuth();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'TypeORM API Docs',
    customfavIcon:
      'https://images.myloapp.in/mydo_upload/mydo_upload_1625802074_1174352256.png',
  };

  SwaggerModule.setup(
    SWAGGER_DOCUMENTATION_PATH,
    app,
    SwaggerModule.createDocument(app, config.build()),
    customOptions,
  );
  await app.listen(AppPort[appEnvironment]);
  console.info(
    `Mylo Ware service started at http://127.0.0.1:${AppPort[appEnvironment]}/ in ${appEnvironment} environment`,
  );

  if (appEnvironment != AppEnvironment.PRODUCTION) {
    console.info(
      `Api documentation available at http://127.0.0.1:${AppPort[appEnvironment]}/${SWAGGER_DOCUMENTATION_PATH}/`,
    );
  }
}

bootstrap();
