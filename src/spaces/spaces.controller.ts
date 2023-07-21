import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DoSpacesService } from './SpacesService/doSpaceService';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedMulterFileI } from './SpacesService';
import {Public} from "../auth/guard";

@Public()
@Controller('/spaces')
export class SpacesController {
  constructor(private readonly doSpacesService: DoSpacesService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadFile(@UploadedFile() file: UploadedMulterFileI) {
    const url = await this.doSpacesService.uploadFile(file);

    return {
      url,
    };
  }
}
