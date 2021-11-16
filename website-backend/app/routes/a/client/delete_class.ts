import express from 'express';
import { studioCors } from '@cors/studio';
import { ClientClass } from '@models/client_class';
import ConnectEnsureLogin from 'connect-ensure-login';
import Log from '@root/log';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    ClientClass.findByPk(req.body.classId)
      .then(clientClass => {
        if (clientClass) {
          clientClass.deleted = true;
          clientClass
            .save()
            .then(saved => {
              // Return all classs
              ClientClass.findAll({
                order: [['name', 'ASC']],
                where: {
                  clientId: clientClass.clientId,
                  deleted: false,
                },
              })
                .then(classes => {
                  res.json(classes);
                })
                .catch((err: Error) => {
                  Log.error('no classes found');
                  Log.error(err);
                  res.json(err);
                });
            })
            .catch((err: Error) => {
              res.json(err);
            });
        } else {
          throw new Error(`Unable to delete Client Class. Cannot find a Client Class with an id of ${req.body.classId}.`)
        }
      })
      .catch((err: Error) => {
        res.json(err);
      });
  },
);

module.exports = Router;
