// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import ConnectEnsureLogin from 'connect-ensure-login';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    const { id, firstName, lastName, email, emailNotifications } = req.body;

    try {
      const user = await User.findOne({
        attributes: ['id', 'username', 'firstName', 'lastName', 'email'],
        where: { id: req.body.id },
      });

      if (!user) {
        throw new Error(`User not found with an id of "${id}". Unable to edit the user.`);
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.emailNotifications = emailNotifications;
      await user.save();

      res.send('success');
    } catch (err) {
      res.send(`Error: ${err}`);
    }
  },
);

module.exports = Router;
