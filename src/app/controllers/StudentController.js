import * as Yup from 'yup';

import Student from '../models/Student';
import Band from '../models/Band';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll();
    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      nickname: Yup.string().required(),
      email: Yup.string().email().required(),
      birth: Yup.date().required(),
      band_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Invalid request' });
    }

    const { name, nickname, email, birth, band_id } = req.body;

    const studentExists = await Student.findOne({
      paranoid: false,
      where: {
        email,
      },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const bandExists = await Band.findOne({
      paranoid: false,
      where: {
        id: band_id,
      },
    });

    if (!bandExists) {
      return res.status(400).json({ error: 'Band does not exists' });
    }

    const student = await Student.create({
      name,
      nickname,
      email,
      birth,
      band_id,
    });

    return res.json(student);
  }

  async find(req, res) {
    const params = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await params.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      nickname: Yup.string().required(),
      email: Yup.string().email().required(),
      birth: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Invalid request' });
    }

    const params = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await params.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const { id } = req.params;
    const { name, nickname, email, birth } = req.body;

    const studentExists = await Student.findOne({
      paranoid: false,
      where: {
        email,
      },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    await student.update(
      {
        name,
        nickname,
        email,
        birth,
      },
      { new: true }
    );

    return res.json(student);
  }

  async delete(req, res) {
    const { id } = req.params;

    const params = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await params.isValid(req.params))) {
      return res.status(400).json({ error: 'Invalid Id' });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'User does not exists' });
    }

    student.destroy();

    return res.json(student);
  }
}

export default new StudentController();
