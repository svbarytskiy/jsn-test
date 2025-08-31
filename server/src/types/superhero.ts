import { UploadedFile } from 'express-fileupload';
import { Document } from 'mongoose';
import { Request } from 'express';

export interface ISuperhero extends Document {
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string[];
  catch_phrase: string;
  images: string[];
}

export type SuperheroRequestBody = Omit<ISuperhero, 'images'> & {
  images?: string[];
};

export interface SuperheroRequestParams {
  nickname: string;
}

export interface PaginationRequestQuery {
  page?: string;
  limit?: string;
}

export interface RequestWithFiles extends Request {
  body: SuperheroRequestBody;
  files?: { [key: string]: UploadedFile | UploadedFile[] };
}

export interface UpdateRequest extends Request {
  files?: {
    new_images?: UploadedFile | UploadedFile[];
  };
  body: {
    nickname?: string;
    real_name?: string;
    origin_description?: string;
    superpowers?: string;
    catch_phrase?: string;
    existing_images?: string;
  };
}
