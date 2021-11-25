import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(payload: {userID: string}): Promise<ValidationResponse> {
    return { userID: payload.userID };
  }
}

interface ValidationResponse {
  userID: string;
}

export interface JwtValidationOutput {
  user: ValidationResponse;
}
