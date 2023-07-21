import { Module } from '@nestjs/common';
import { SpacesController } from './spaces.controller';
import { DoSpacesService } from './SpacesService/doSpaceService';
import { DoSpacesServicerovider } from './SpacesService';

@Module({
  imports: [],
  controllers: [SpacesController],
  // provide both the service and the custom provider
  providers: [DoSpacesServicerovider, DoSpacesService],
})
export class SpacesModule {}
