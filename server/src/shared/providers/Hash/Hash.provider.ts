import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class HashProvider {
  async generate(payload: string) {
    return hash(payload, 8);
  }

  async verify(payload: string, hash: string) {
    return compare(payload, hash);
  }
}
