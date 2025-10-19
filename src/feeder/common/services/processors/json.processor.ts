import { Injectable } from '@nestjs/common';
import { Duplex } from 'node:stream';
import * as JSONStream from 'jsonstream';

@Injectable()
export class JsonProcessor {
  process(): Duplex {
    const jsonItemStream = JSONStream.parse('*');

    return jsonItemStream as unknown as Duplex;
  }
}
