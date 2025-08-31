import { ISuperhero } from '@/types/superhero';
import { Schema, model } from 'mongoose';

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
