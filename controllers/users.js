const User = require('../models/user');

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(200).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).send({ data: user });
    }
  } catch (error) {
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    // const { userId } = req.user._id;
    const user = await User.findByIdAndUpdate(req.user._id, { name, about });
    res.status(200).send({
      name: user.name,
      about: user.about,
    });
  } catch (error) {
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar });
    res.status(200).send({ avatar: user.avatar });
  } catch (error) {
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
};
