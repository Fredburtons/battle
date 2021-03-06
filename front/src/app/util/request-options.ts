import { RequestOptions, Headers } from '@angular/http';

export function createRequestOptions(withToken:boolean=false,
    additionalHeaders?:Headers): RequestOptions {

  let headers = new Headers();
  headers.append("Content-Type", 'application/json');
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Headers", "Origin, Authorization, Content-Type");

  if(withToken) {
    let user = JSON.parse(window.sessionStorage.getItem('user'));
    if(user) {
      const token = user.token;
      headers.append('Authorization', token);
    }
  }

  if(additionalHeaders) {
    additionalHeaders.forEach((values, header) => {
      values.forEach(value => {
        headers.append(header, value);
      });
    });
  }

  return new RequestOptions({ headers: headers });
}