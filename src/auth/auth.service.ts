import {ForbiddenException, Injectable} from '@nestjs/common';
import {SignupDto} from "./dto/signup.dto";
import {LoginDto} from "./dto/login.dto";
import * as argon from 'argon2';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {PrismaService} from "../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,private config: ConfigService, private jwt: JwtService) {
    }
    async signup(signupDto: SignupDto){
        //1. Generate password hash
        const hash = await argon.hash(signupDto.password);
        //2. save new user in the db
        try{
            const user = await this.prisma.user.create({
                data: {
                    email: signupDto.email,
                    hash,
                    name: signupDto.name,
                },
            });
            delete user.hash;
            //return user infor
            return user;
        }catch(error){
            if (
                error instanceof
                PrismaClientKnownRequestError
            ) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials taken',
                    );
                }
            }
            throw error;
        }
        return hash;
    }
    async login(loginDto: LoginDto){
        //find user by email
        const user =
            await this.prisma.user.findUnique({
                where: {
                    email: loginDto.email,
                },
            });
        //if user does not exist throw exception
        if (!user) {
            throw new ForbiddenException(
                'Credential incorrect',
            );
        }
        //compare password
        const pwMatches = await argon.verify(
            user.hash,
            loginDto.password,
        );
        //if password incorrect throw exception
        if (!pwMatches) {
            throw new ForbiddenException(
                'Credential incorrect',
            );
        }
        //send back the token
        return this.signToken(user.id, user.email);
    }

    async signToken(
        userId: number,
        email: string,
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email: email,
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '15m',
                secret: secret,
            },
        );

        return {
            access_token: token,
        };
    }
}
