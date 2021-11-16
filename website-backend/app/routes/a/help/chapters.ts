// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { HelpChapter } from '@models/help_chapter';
import { studioCors } from '@cors/studio';
const Router = express.Router();

Router.options('/', studioCors);

Router.get('/', studioCors, async (req: express.Request, res: express.Response) => {
  try {
    const chapters = await HelpChapter.findAllForStudio();
    res.json(chapters);
  } catch (err) {
    res.json(err);
  }
});

module.exports = Router;
