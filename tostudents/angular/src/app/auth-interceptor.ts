import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';

// ...
// Example of user credentials to match against incoming credentials.
const username  = 'me@domain.com';
const password  = 'password';

// list of friends to return when the route /api/friends is invoked.
const friends   = ['alice', 'bob', 'John Doe'];

// the hardcoded JWT access token you created @ jwt.io.
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlN1bHRhbiBQbHVtZSIsImlhdCI6MTUxNjIzOTAyMn0.sqSoswkcfbpx1fKUzIT9kd_-9Go2SXrwUIBG3EoLaaU';

// ...
// Use these methods in the implementation of the intercept method below to return either a success or failure response.
const makeError = (status, error) => {
    return Observable.throw(
        new HttpErrorResponse({
            status,
            error
        })
    );
};

const makeResponse = body => {
    return of(
        new HttpResponse({
            status: 200,
            body
        })
    );
};

// ...

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const { 
        body,       // object
        headers,    // object
        method,     // string
        url,        // string
    } = req;

    if(url === '/login') {
      if(body.username === username && body.password === password) {
        return makeResponse({
          token: token
        });
      } else {
        console.log('Error: ', makeError(401, {}));
        return makeError(401, {});
      }
    } else {
      makeError(500, {})
    }
    if(url === '/friends') {
      if(headers.has('Authorization')) {
        if(headers.get('Authorization') === `Bearer ${token}`) {
          return makeResponse({
            friends
        })
        } else {
          return makeError(401, 'Unauthorized token')
          }
      } else {
        return makeError(400, 'No authorization token')
      }
    } else {
      return makeError(500, {})
    }


  }
}
