const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { recipient, message } = req.body;
  const sender = req.userData.userId;

  try {
    const newMessage = await Message.create({
      sender,
      recipient, // include recipient
      message,
      timestamp: new Date(),
    });
    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.fetchMessages = async (req, res) => {
  const userId = req.userData.userId;
  try {
    const messages = await Message.findAll({
      where: {
        [Sequelize.Op.or]: [{ sender: userId }, { recipient: userId }],
      },
    });
    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
