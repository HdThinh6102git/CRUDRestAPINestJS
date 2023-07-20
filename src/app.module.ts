import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import {JwtGuard} from "./auth/guard";
import {APP_GUARD} from "@nestjs/core";
import {ConfigService} from "@nestjs/config";


@Module({
  imports: [AuthModule, UserModule, PostModule, PrismaModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
      ConfigService
  ],
})
export class AppModule {}
