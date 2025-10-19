import { Injectable } from '@nestjs/common';
import { Readable } from 'node:stream';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3LoaderService {
  private s3Client: S3;

  constructor() {
    //todo move to module level
    // this.s3url = 'https://buenro-tech-assessment-materials.s3.eu-north-1.amazonaws.com/structured_generated_data.json';
    this.s3Client = new S3({
      region: 'eu-north-1',
    });
  }

  async load(bucket: string, key: string): Promise<Readable> {
    const s3Command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await this.s3Client.send(s3Command);

    const stream = response.Body as Readable;
    stream.setEncoding('utf8');
    return stream;
  }
}
