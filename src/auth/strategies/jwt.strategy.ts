import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      /*
      secretOrKey: we are using the expedient option of supplying a 
      symmetric secret for signing the token. Other options, such as a 
      PEM-encoded public key, may be more appropriate for production apps.
      https://github.com/mikenicholson/passport-jwt#configure-strategy
      */
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      // roles: payload.roles.map(role => role.role)
      roles: payload.roles ? payload.roles : []
    };
  }
}