import { Request, Response, NextFunction } from 'express';
import {
  SuperheroRequestParams,
  SuperheroRequestBody,
  PaginationRequestQuery,
  RequestWithFiles,
  UpdateRequest,
} from '@/types/superhero';
import superheroService from '@/services/superhero.service';
import { UploadedFile } from 'express-fileupload';

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

  public getSuperheroByNickname = async (
    req: Request<SuperheroRequestParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { nickname } = req.params;
      const superhero = await superheroService.getSuperheroNickName(nickname);
      if (!superhero) {
        return res.status(404).json({ message: 'Superhero not found' });
      }
      res.status(200).json(superhero);
    } catch (error) {
      next(error);
    }
  };

  public createSuperhero = async (req: RequestWithFiles, res: Response, next: NextFunction) => {
    try {
      const superheroData: SuperheroRequestBody = req.body;
      const superpowersArray: string[] = Array.isArray(superheroData.superpowers)
        ? superheroData.superpowers
        : JSON.parse(superheroData.superpowers);

      const newImages: UploadedFile[] =
        req.files && typeof req.files === 'object' && req.files.images
          ? Array.isArray(req.files.images)
            ? req.files.images
            : [req.files.images]
          : [];

      const newSuperhero = await superheroService.createSuperhero(
        {
          ...superheroData,
          superpowers: superpowersArray,
        },
        newImages
      );

      res.status(201).json({ message: 'Superhero created successfully', data: newSuperhero });
    } catch (error) {
      next(error);
    }
  };

  public updateSuperhero = async (req: UpdateRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const imagesToKeep = req.body.existing_images ? JSON.parse(req.body.existing_images) : [];
      const superpowers = req.body.superpowers ? JSON.parse(req.body.superpowers) : [];
      const newImages = req.files?.new_images
        ? Array.isArray(req.files.new_images)
          ? req.files.new_images
          : [req.files.new_images]
        : [];

      const updatedData = {
        nickname: req.body.nickname,
        real_name: req.body.real_name,
        origin_description: req.body.origin_description,
        superpowers: superpowers,
        catch_phrase: req.body.catch_phrase,
      };
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
      const { nickname } = req.params;
      const deletedSuperhero = await superheroService.deleteSuperhero(nickname);

      if (!deletedSuperhero) {
        return res.status(404).json({ message: 'Superhero not found' });
      }

      res.status(200).json({ message: 'Superhero deleted successfully', data: deletedSuperhero });
    } catch (error) {
      next(error);
    }
  };
}

export default new SuperheroController();
