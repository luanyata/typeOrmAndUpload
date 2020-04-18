import { getRepository } from 'typeorm';

import Category from '../models/Category';

class CreateCategoryService {
  public async execute(title: string): Promise<Category> {
    const categoryRepository = getRepository(Category);

    let categoryDb = await categoryRepository.findOne({
      where: { title },
    });

    if (!categoryDb) {
      categoryDb = categoryRepository.create({ title });

      categoryDb = await categoryRepository.save(categoryDb);
    }

    return categoryDb;
  }
}

export default CreateCategoryService;
