import { Superhero } from '@/models/superhero-model';
import { ISuperhero } from '@/types/superhero';
import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';

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

  public async createSuperhero(superheroData: ISuperhero) {
    console.log('all good 2');
    return Superhero.create(superheroData);
  }

  public async deleteSuperhero(nickname: string): Promise<ISuperhero | null> {
    const deletedSuperhero = await Superhero.findOneAndDelete({ nickname });
    return deletedSuperhero;
  }

  public async updateSuperhero({
    nickname,
    updatedData,
    imagesToKeep = [],
    newImages = [],
  }: {
    nickname: string;
    updatedData: Partial<ISuperhero>;
    imagesToKeep?: string[];
    newImages?: UploadedFile[];
  }) {
    const existingSuperhero = await Superhero.findOne({ nickname: nickname });

    if (!existingSuperhero) {
      return null;
    }

    if (existingSuperhero.images) {
      const imagesToDelete = existingSuperhero.images.filter(
        (imagePath) => !imagesToKeep.includes(imagePath)
      );

      imagesToDelete.forEach((imagePath) => {
        const fullPath = path.join(__dirname, '../../public', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    const newImagePaths: string[] = [];
    if (newImages.length > 0) {
      const superheroNickname = (updatedData.nickname || existingSuperhero.nickname)
        .replace(/\s+/g, '-')
        .toLowerCase();
      const destinationPath = path.join(
        __dirname,
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

    const finalImages = [...(imagesToKeep || []), ...newImagePaths];

    return Superhero.findOneAndUpdate(
      { nickname },
      { ...updatedData, images: finalImages },
      { new: true }
    );
  }
}

export default new SuperheroService();
