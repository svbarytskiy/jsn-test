import { Schema, model, Document } from 'mongoose';

export interface ISuperhero extends Document {
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string[];
  catch_phrase: string;
  images: string[];
}

const SuperheroSchema = new Schema<ISuperhero>(
  {
    nickname: { type: String, required: true, unique: true },
    real_name: { type: String, required: true },
    origin_description: { type: String, required: true },
    superpowers: { type: [String], required: true },
    catch_phrase: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Superhero = model<ISuperhero>('Superhero', SuperheroSchema);
