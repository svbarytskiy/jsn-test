import { FileArray, UploadedFile } from 'express-fileupload';
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

export interface ISuperheroDocument extends ISuperhero, Document {}

export type SuperheroRequestBody = Omit<ISuperhero, 'images'> & {
  images?: string[];
};

export interface SuperheroRequestParams {
  id: string;
}

export interface PaginationRequestQuery {
  page?: string;
  limit?: string;
}

export interface RequestWithFiles extends Request {
  body: SuperheroRequestBody;
  files?: { [key: string]: UploadedFile | UploadedFile[] };
}

export interface RequestWithFilesAndBody
  extends Request<SuperheroRequestParams, unknown, SuperheroRequestBody> {
  body: SuperheroRequestBody & {
    imagesToKeep?: string[];
  };
  files?: FileArray;
}
