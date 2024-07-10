import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import OAuth from 'oauth-1.0a';
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class FluigAuthService {

  constructor() { }

  getOAuthHeader(method: string, url: string) {
    const oAuth = new OAuth({
      consumer: {
        key: environment.CONSUMER_KEY,
        secret: environment.CONSUMER_SECRET
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (base_string, key) => {
        return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
      }
    });
    const token = {
      key: environment.TOKEN_KEY,
      secret: environment.TOKEN_SECRET
    };
    const authorizationHeader = oAuth.toHeader(oAuth.authorize({ method, url }, token)).Authorization;
    const headers = new HttpHeaders({
      'Authorization': authorizationHeader
    });

    return headers
  }
}
