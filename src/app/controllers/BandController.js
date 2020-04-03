import * as Yup from 'yup';

import Band from '../models/Band';

class BandController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      color: Yup.string().required(),
      sequence: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const { name, color, sequence } = req.body;

    const bandExists = await Band.findOne({ color });

    if (bandExists) {
      return res.status(400).json({ error: 'Color already exists' });
    }

    const band = await Band.create({
      name,
      color,
      sequence,
    });

    return res.json(band);
  }
}

export default new BandController();
