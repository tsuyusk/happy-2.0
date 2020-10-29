import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './modules/users/user.module';
import { OrphanagesModule } from './modules/orphanages/orphanage.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',

      url: 'postgresql://postgres:docker@localhost:5432/happy_nestjs',

      entities: [
        join(__dirname, 'modules', '**', 'entities', '*.entity{.ts,.js}'),
      ],

      migrations: [
        join(__dirname, 'shared', 'database', 'migrations', '*{.ts,.js}'),
      ],

      synchronize: true,
    }),
    UserModule,
    OrphanagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
