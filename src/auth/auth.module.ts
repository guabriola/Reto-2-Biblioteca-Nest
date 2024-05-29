import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';


@Module({
    imports: [
        UsersModule, 
        PassportModule,
        JwtModule.register({
            //Todo ----->>>>> Change secretJWT to a env Avriable its a must.
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' },
          }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}