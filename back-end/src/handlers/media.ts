///
/// IMPORTS
///

import { DynamoDB, ResourceController, S3 } from 'idea-aws';
import { SignedURL } from 'idea-toolbox';

///
/// CONSTANTS, ENVIRONMENT VARIABLES, HANDLER
///

const PROJECT = process.env.PROJECT;
const ddb = new DynamoDB();

const S3_BUCKET_MEDIA = process.env.S3_BUCKET_MEDIA;
const S3_IMAGES_FOLDER = process.env.S3_IMAGES_FOLDER;
const s3 = new S3();

export const handler = (ev: any, _: any, cb: any): Promise<void> => new Media(ev, cb).handleRequest();

///
/// RESOURCE CONTROLLER
///

class Media extends ResourceController {
  constructor(event: any, callback: any) {
    super(event, callback);
  }

  protected async postResources(): Promise<SignedURL> {
    const imageURI = await ddb.IUNID(PROJECT.concat('-media'));

    const key = `${S3_IMAGES_FOLDER}/${imageURI}.png`;
    const signedURL = await s3.signedURLPut(S3_BUCKET_MEDIA, key);
    signedURL.id = imageURI;

    return signedURL;
  }
}
