// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Project } from '@models/project';
import { ProjectResourcesUpload } from '@models/project_resources_upload';
import { RabbitMessage } from '@models/rabbit_message';
import Log from '@root/log';
const Router = express.Router();

Router.post('/', async (req: express.Request, res: express.Response) => {
  if (!['REDACTED'].includes(req.ip)) {
    res.json('unauthorized');
  } else {
    try {
      const project = await Project.findOne({ where: { uid: req.body.uid } });
      if (project) {
        // Record this submission in the database
        await ProjectResourcesUpload.create({
          projectId: project.id,
          filename: req.body.filename
        });

        // Send a rabbit message to extract the files
        const data = {
          projectUid: project.uid,
          filename: req.body.filename,
        };
        const userId = req.user?.id ? req.user?.id : 21; // 3XR System
        await RabbitMessage.sendNewMessageToQueueWithData('extract_project_resources', data, userId);
        res.json('success');
      } else {
        Log.error('Project not found with uid ' + req.body.uid);
        throw new Error();
      }
    } catch (err) {
      Log.error((err as Error).message);
      Log.error('Error processing resource files for project with uid ' + req.body.uid);
      res.json('error getting project by uid');
    }
  }
});

module.exports = Router;
