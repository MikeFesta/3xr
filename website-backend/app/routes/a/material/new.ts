// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { BlendModeEnum } from '@enums';
import { studioCors } from '@cors/studio';
import { Material } from '@models/material';
import Errors from '@root/errors';
import helpers from '@root/helpers';
import { RabbitMessage } from '@models/rabbit_message';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resAdminOnly(res);
    } else {
      const blendName = helpers.convertToAlphaSnakeCase(req.body.name).substring(0, 40); // blender filenames cannot be too long
      const nameInUse = await Material.findAll({ where: { blendName: blendName } });
      if (nameInUse.length > 0) {
        res.json({
          success: false,
          errorMessage: 'A Material already exists with the blender filename ' + blendName,
        });
      } else {
        const uid = await helpers.getNewUidForModel(Material, 12);
        const diffuseHex = req.body.diffuseColorHex;
        const red = parseInt(diffuseHex.substring(0, 2), 16);
        const green = parseInt(diffuseHex.substring(2, 4), 16);
        const blue = parseInt(diffuseHex.substring(4, 6), 16);
        const material = await Material.create({
          blendMode: BlendModeEnum.OPAQUE, // defaulting to opaque for now
          blendName,
          diffuseBlueValue: blue,
          diffuseGreenValue: green,
          diffuseRedValue: red,
          metallicValue: req.body.metallic ? 1 : 0,
          mappingScaleValue: req.body.mappingScale,
          normalStrengthValue: req.body.normalStrength,
          name: req.body.name,
          roughnessValue: req.body.roughness,
          uid,
        });
        if (material) {
          // Init via rabbit
          const data = {
            blendName,
            diffuse: diffuseHex,
            metallic: req.body.metallic ? 1 : 0,
            roughness: req.body.roughness,
            // TODO: pass mapping scale and normal strength to material
            uid,
          };
          await RabbitMessage.sendNewMessageToQueueWithData('init_material', data, req.user.id);
          res.json({
            success: true,
            uid: uid,
          });
        } else {
          res.json({
            success: false,
            errorMessage: 'Unable to create material',
          });
        }
      }
    }
  },
);

module.exports = Router;
