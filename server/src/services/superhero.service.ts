import { Superhero } from '@/models/superhero-model';
import { ISuperhero, SuperheroRequestBody } from '@/types/superhero';
import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(__filename);

class SuperheroService {
  public async getSuperheroes(page: number, limit: number) {
    const superheroes = await Superhero.find()
      .select('nickname images')
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalItems = await Superhero.countDocuments();

    return {
      superheroes: superheroes.map((superhero) => ({
        nickname: superhero.nickname,
        images: superhero.images.length > 0 ? [superhero.images[0]] : [],
        _id: superhero._id,
      })),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      currentPage: page,
    };
  }

  public async getSuperheroById(id: string) {
    return Superhero.findById(id);
  }

  public async getSuperheroNickName(nickName: string) {
    return Superhero.findOne({ nickname: nickName });
  }

  public async createSuperhero(
    superheroData: SuperheroRequestBody,
    newImages: UploadedFile[] = []
  ) {
    const superheroNickname = superheroData.nickname.replace(/\s+/g, '-').toLowerCase();
    const destinationPath = path.join(
      currentDirname,
      '../../public/images/superheroes',
      superheroNickname
    );
    const images: string[] = [];

    if (newImages.length > 0) {
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      for (const file of newImages) {
        const uniqueFileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const filePath = path.join(destinationPath, uniqueFileName);

        try {
          await file.mv(filePath);
          images.push(`/images/superheroes/${superheroNickname}/${uniqueFileName}`);
        } catch (mvError) {
          console.error(`Error moving file "${file.name}":`, mvError);
          if (fs.existsSync(destinationPath) && fs.readdirSync(destinationPath).length === 0) {
            fs.rmdirSync(destinationPath);
          }
          throw new Error('Failed to save images.');
        }
      }
    }

    return Superhero.create({ ...superheroData, images });
  }

  public async deleteSuperhero(nickname: string): Promise<ISuperhero | null> {
    const deletedSuperhero = await Superhero.findOneAndDelete({ nickname });

    if (deletedSuperhero) {
      const superheroNickname = deletedSuperhero.nickname.replace(/\s+/g, '-').toLowerCase();
      const destinationPath = path.join(
        currentDirname,
        '../../public/images/superheroes',
        superheroNickname
      );

      if (fs.existsSync(destinationPath)) {
        fs.rmSync(destinationPath, { recursive: true, force: true });
      } else {
        console.warn(`Directory not found: ${destinationPath}`);
      }
    }

    return deletedSuperhero;
  }

  public async updateSuperhero({
    id,
    updatedData,
    imagesToKeep = [],
    newImages = [],
  }: {
    id: string;
    updatedData: Partial<ISuperhero>;
    imagesToKeep?: string[];
    newImages?: UploadedFile[];
  }) {
    const existingSuperhero = await Superhero.findOne({ _id: id });

    if (!existingSuperhero) {
      return null;
    }

    if (updatedData.nickname && updatedData.nickname !== existingSuperhero.nickname) {
      const isNicknameTaken = await Superhero.findOne({ nickname: updatedData.nickname });
      if (isNicknameTaken) {
        throw new Error('This nickname is already taken.');
      }
    }

    if (existingSuperhero.images) {
      const imagesToDelete = existingSuperhero.images.filter(
        (imagePath) => !imagesToKeep.includes(imagePath)
      );

      imagesToDelete.forEach((imagePath) => {
        const fullPath = path.join(currentDirname, '../../public', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    const oldNickname = existingSuperhero.nickname.replace(/\s+/g, '-').toLowerCase();
    const newNickname = (updatedData.nickname || existingSuperhero.nickname)
      .replace(/\s+/g, '-')
      .toLowerCase();

    if (oldNickname !== newNickname) {
      const oldPath = path.join(currentDirname, '../../public/images/superheroes', oldNickname);
      const newPath = path.join(currentDirname, '../../public/images/superheroes', newNickname);
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    }

    const newImagePaths: string[] = [];
    if (newImages.length > 0) {
      const superheroNickname = newNickname;
      const destinationPath = path.join(
        currentDirname,
        '../../public/images/superheroes',
        superheroNickname
      );

      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      for (const file of newImages) {
        const uniqueFileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const filePath = path.join(destinationPath, uniqueFileName);
        await file.mv(filePath);
        newImagePaths.push(`/images/superheroes/${superheroNickname}/${uniqueFileName}`);
      }
    }

    const updatedImagesToKeep = imagesToKeep.map((imagePath) =>
      imagePath.replace(`/images/superheroes/${oldNickname}`, `/images/superheroes/${newNickname}`)
    );

    const finalImages = [...(updatedImagesToKeep || []), ...newImagePaths];

    return Superhero.findOneAndUpdate(
      { _id: id },
      { ...updatedData, images: finalImages },
      { new: true }
    );
  }
}

export default new SuperheroService();
