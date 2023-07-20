import {Body, Controller, Delete, Get, Param, Put, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";

import { User } from '@prisma/client';
import {GetUser} from "../decorator";
import {PrismaService} from "../prisma/prisma.service";
import {Public} from "../auth/guard";
import {UpdateUserDto} from "./dto/update-user.dto";



@Controller('user')
@UseGuards()
export class UserController {
    constructor(private userService: UserService, private prisma: PrismaService) {
    }

    @Get('profile')
    getProfileById(@GetUser() userDto: User){

        return this.userService.getProfileById(userDto);
    }

    @Get('all')
    getAll(){
        return this.userService.getAll();
    }
    @Public()
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        return this.userService.updateById(id, updateUserDto);
    }
    @Public()
    @Delete(':id')
    delete(@Param('id') id: string){
        return this.userService.deleteById(id);
    }
}
