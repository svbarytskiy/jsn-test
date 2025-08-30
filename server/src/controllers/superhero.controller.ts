import { Request, Response, NextFunction } from 'express';
import {
  SuperheroRequestParams,
  SuperheroRequestBody,
  PaginationRequestQuery,
  RequestWithFiles,
  RequestWithFilesAndBody,
} from '@/types/superhero';
import superheroService from '@/services/superhero.service';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';

class SuperheroController {
  public getSuperheroes = async (
    req: Request<unknown, unknown, unknown, PaginationRequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '5', 10);
      const result = await superheroService.getSuperheroes(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getSuperhero = async (
    req: Request<SuperheroRequestParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const superhero = await superheroService.getSuperheroById(id);
      if (!superhero) {
        return res.status(404).json({ message: 'Superhero not found' });
      }
      res.status(200).json({ data: superhero });
    } catch (error) {
      next(error);
    }
  };

  public createSuperhero = async (req: RequestWithFiles, res: Response, next: NextFunction) => {
    try {
      const superheroData: SuperheroRequestBody = req.body;
      const images: string[] = [];

      if (req.files && typeof req.files === 'object') {
        const filesToProcess: UploadedFile[] = Array.isArray(req.files.images)
          ? req.files.images
          : [req.files.images];

        for (const file of filesToProcess) {
          const superheroNickname: string = superheroData.nickname
            .replace(/\s+/g, '-')
            .toLowerCase();
          const destinationPath: string = path.join(
            __dirname,
            '../../public/images/superheroes',
            superheroNickname
          );

          if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
          }
          const uniqueFileName: string = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
          const filePath: string = path.join(destinationPath, uniqueFileName);
          await file.mv(filePath);
          images.push(`/images/superheroes/${superheroNickname}/${uniqueFileName}`);
        }
      }
      const newSuperhero = await superheroService.createSuperhero({ ...superheroData, images });
      res.status(201).json({ message: 'Superhero created successfully', data: newSuperhero });
    } catch (error) {
      next(error);
    }
  };

  public updateSuperhero = async (
    req: RequestWithFilesAndBody,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { imagesToKeep, ...updatedData } = req.body;
      let newImages: UploadedFile[] = [];

      if (req.files && req.files.images) {
        newImages = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      }

      const updatedSuperhero = await superheroService.updateSuperhero({
        id,
        updatedData,
        imagesToKeep,
        newImages,
      });

      if (!updatedSuperhero) {
        return res.status(404).json({ message: 'Superhero not found' });
      }

      res.status(200).json({ message: 'Superhero updated successfully', data: updatedSuperhero });
    } catch (error) {
      next(error);
    }
  };

  public deleteSuperhero = async (
    req: Request<SuperheroRequestParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const deletedSuperhero = await superheroService.deleteSuperhero(id);

      if (!deletedSuperhero) {
        return res.status(404).json({ message: 'Superhero not found' });
      }

      const superheroNickname = deletedSuperhero.nickname.replace(/\s+/g, '-').toLowerCase();
      const destinationPath = path.join(
        __dirname,
        '../../public/images/superheroes',
        superheroNickname
      );

      if (fs.existsSync(destinationPath)) {
        fs.rmSync(destinationPath, { recursive: true, force: true });
      }

      res.status(200).json({ message: 'Superhero deleted successfully', data: deletedSuperhero });
    } catch (error) {
      next(error);
    }
  };
}

export default new SuperheroController();
