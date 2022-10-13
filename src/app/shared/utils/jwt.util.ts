import {Params} from '@angular/router';

// import {KJUR, KEYUTIL} from 'jsrsasign';
import {KJUR} from 'jsrsasign';

export class NoTokenError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidTokenError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ExpiredTokenError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class JWTUtil {
  private static unescape(str: string) {
    return str.replace(/-/g, '+').replace(/_/g, '/');
  }

  static base64UrlDecodeToJSON(str: string) {
    return JSON.parse(
      Buffer.from(JWTUtil.unescape(str), 'base64').toString('utf8')
    );
  }

  static createToken(
    data: Params,
    privateKey: string,
    aud: string,
    iss: string,
    jti: string
  ) {
    const midNigth = new Date();
    midNigth.setDate(midNigth.getDate() + 1);
    midNigth.setHours(0);
    midNigth.setMinutes(0);
    midNigth.setSeconds(0);
    midNigth.setMilliseconds(0);

    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);

    // Duracion en minutos
    const duration =
      Math.floor((midNigth.getTime() - now.getTime()) / 1000) / 60;
    // Si los minutos son muy pocos, le suma un dia
    if (duration < 60) {
      midNigth.setDate(midNigth.getDate() + 1);
    }

    return KJUR.jws.JWS.sign(
      null,
      {alg: 'ES256'},
      {
        data,
        iat: Math.floor(now.getTime() / 1000),
        exp: Math.floor(midNigth.getTime() / 1000),
        aud,
        iss,
        jti,
      },
      privateKey
    );
  }

  static verifyToken(token: string, publicKey: string) {
    if (!token) {
      throw new NoTokenError('No token');
    }

    const parts = token.split('.');

    const header = JWTUtil.base64UrlDecodeToJSON(parts[0]);
    // @TODO: cuando el jwt se genera con esta misma libreria no esta quedando
    // la propiedad "typ" en el header
    // if (header.alg !== 'ES256' || header.typ !== 'JWT') {
    if (header.alg !== 'ES256') {
      throw new InvalidTokenError('El token no es valido');
    }

    const payload = JWTUtil.base64UrlDecodeToJSON(parts[1]);
    const exp = payload.exp;
    if (exp) {
      let now = new Date().getTime();
      // To get the timestamp in seconds
      now = Math.floor(now / 1000);
      if (now > exp) {
        throw new ExpiredTokenError('El token expiro');
      }
    }

    // const pubKey = KEYUTIL.getKey(publicKey);
    // const isValid = KJUR.jws.JWS.verifyJWT(token, pubKey, {alg: ['ES256']});
    // @ts-ignore
    const isValid = KJUR.jws.JWS.verifyJWT(token, publicKey, {alg: ['ES256']});

    if (!isValid) {
      throw new InvalidTokenError('El token no es valido');
    }

    return payload;
  }
}
