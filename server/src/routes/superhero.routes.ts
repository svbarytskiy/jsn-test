import { Router, RequestHandler } from 'express';
import SuperheroController from '@/controllers/superhero.controller';
import { SuperheroRequestParams } from '@/types/superhero';

const router: Router = Router();
router.get('/', SuperheroController.getSuperheroes.bind(SuperheroController) as RequestHandler);

router.get(
  '/:nickname',
  SuperheroController.getSuperheroByNickname.bind(
    SuperheroController
  ) as RequestHandler<SuperheroRequestParams>
);

router.post('/', SuperheroController.createSuperhero.bind(SuperheroController) as RequestHandler);

router.put(
  '/:nickname',
  SuperheroController.updateSuperhero.bind(
    SuperheroController
  ) as RequestHandler<SuperheroRequestParams>
);

router.delete(
  '/:nickname',
  SuperheroController.deleteSuperhero.bind(
    SuperheroController
  ) as RequestHandler<SuperheroRequestParams>
);

export default router;
