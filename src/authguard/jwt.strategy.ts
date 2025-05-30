import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:  process.env.JWT_SECRET,   // O'zingizning sirli kalitingizni kiriting
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);
    
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
