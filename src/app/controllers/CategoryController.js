import Category from '../models/Category';

class CategoryContrller {
  async index(req, res) {
    const categories = await Category.findAll();

    return res.json(categories);
  }
}

export default new CategoryContrller();
