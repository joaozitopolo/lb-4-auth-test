import {Lb_4AuthTestApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {Lb_4AuthTestApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new Lb_4AuthTestApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
