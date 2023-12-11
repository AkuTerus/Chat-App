import userModel from './../models//userModel.js';

export default {
  index: async (req, res) => {
    // user data
    const user = await userModel.getUserByEmail(req.session.userEmail);
    const userId = user.id;

    // query get data has chat and no chat
    const hasChat = await userModel.getHasChat(userId);
    const hasNoChat = await userModel.getHasNoChat(userId);

    res.render('user', {
      title: 'User',
      user,
      chats: { hasChat, hasNoChat },
    });
  },
};
