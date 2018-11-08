import { Provider, inject, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import {
  AuthenticationBindings,
  AuthenticationMetadata,
  UserProfile,
} from '@loopback/authentication';
import { BasicStrategy } from 'passport-http';
import { repository } from '@loopback/repository';
import { UserRepository } from '../repositories';

export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @repository(UserRepository)
    private userRepository: UserRepository,
  ) { }

  value(): ValueOrPromise<Strategy | undefined> {
    // The function was not decorated, so we shouldn't attempt authentication
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    if (name === 'BasicStrategy') {
      return new BasicStrategy(this.verify);
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }

  verify = (
    username: string,
    password: string,
    cb: (err: Error | null, user?: UserProfile | false) => void,
  ) => {
    // find user by name & password
    this.userRepository.find({ where: { email: username, password } }).then(payload => {
      cb(null, payload.length ? payload[0] : false)
    }, err => {
      cb(err, false)
    })
  }
}
