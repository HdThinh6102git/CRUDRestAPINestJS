import {Injectable, ParseIntPipe} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import { User } from '@prisma/client';
import {UpdateUserDto} from "./dto/update-user.dto";
import * as argon from "argon2";
import number = CSS.number;
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {
    }
    async getProfileById(userdto: User){
        const user =
            await this.prisma.user.findUnique({
                where: {
                    email: userdto.email,
                },
                select:{
                    id: true,
                    email: true,
                    name: true,
                },
            });

        return user;
    }
    async getAll(){
        const users = await this.prisma.user.findMany({
            select: {
              id: true,
              email: true,
              name: true,
            },
        })
        return users;
    }
    async deleteById(id: string){
        const deleteuser = await this.prisma.user.delete({
            where: {
              id: Number(id),
            },
            select:{
                email: true,
                id: true,
                name: true,
            }
        })
        return deleteuser;
    }
    async updateById(id: string, updateUserDto: UpdateUserDto){

        //1. Generate password hash
        const hash = await argon.hash(updateUserDto.password);
        const updateUser = await this.prisma.user.update({
            where:{
                id: Number(id),
            },
            data: {
                email: updateUserDto.email,
                hash,
                name: updateUserDto.name,

            },
            select:{
                email: true,
                id: true,
            }
        })
        return updateUser;
    }
}
