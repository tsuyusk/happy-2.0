import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrphanageController } from './orphanage.controller';
import { OrphanageService } from './orphanage.service';
/* Entities */
import { Orphanage } from './entities/orphanage.entity';
import { OrphanagePhoto } from './entities/orphanagePhoto.entity';
import { RequestOrphanage } from './entities/requestOrphanage.entity';
import { RequestOrphanagePhoto } from './entities/requestOrphanagePhoto.entity';

/* Repositories */
import { RequestOrphanagesRepository } from './requestOrphanage.repository';
import { OrphanagesRepository } from './orphanage.repository';
import { EnsureAuthMiddleware } from '../users/middleware/ensureAuth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orphanage,
      OrphanagePhoto,
      RequestOrphanage,
      RequestOrphanagePhoto,
    ]),
  ],
  controllers: [OrphanageController],
  providers: [
    OrphanagesRepository,
    RequestOrphanagesRepository,
    OrphanageService,
  ],
})
export class OrphanagesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(
        { path: 'orphanages/requests/accept/:id', method: RequestMethod.POST },
        { path: 'orphanages/requests', method: RequestMethod.GET },
        { path: 'orphanages/:id', method: RequestMethod.DELETE },
        { path: 'orphanages/:id', method: RequestMethod.PUT },
      );
  }
}
