// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmission } from '@models/asset_submission';
import { AssetSubmissionIssue } from '@models/asset_submission_issue';
import { AssetSubmissionIssueHotspot } from '@models/asset_submission_issue_hotspot';
import { AssetSubmissionIssueImage } from '@models/asset_submission_issue_image';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    let issueId = 0;
    if (!req.user) {
      return res.status(403).send('unauthorized');
    }
    AssetSubmissionIssue.create({
      assetSubmissionId: req.body.id,
      authorUserId: req.user?.id,
      authorRoleId: req.user?.primaryRoleId,
      issueTypeId: req.body.issueTypeId,
      description: req.body.description,
    })
      .then(issue => {
        issueId = issue.id;
        const images: Array<any> = [];
        for (let i = 0; i < req.body.imageFilenames.length; i++) {
          images.push({
            assetSubmissionIssueId: issue.id,
            filename: req.body.imageFilenames[i],
          });
        }
        return AssetSubmissionIssueImage.bulkCreate(images);
      })
      .then(createImagesResult => {
        const hotspots: Array<any> = [];
        for (let i = 0; i < req.body.hotspots.length; i++) {
          hotspots.push({
            assetSubmissionIssueId: issueId,
            normal: req.body.hotspots[i].normal,
            position: req.body.hotspots[i].position,
          });
        }
        return AssetSubmissionIssueHotspot.bulkCreate(hotspots);
      })
      .then(createHotspotsResult => {
        return AssetSubmission.scope('details').findByPk(req.body.id);
      })
      .then(submission => {
        res.json(submission);
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Unable to open an asset submission issue');
      });
  },
);

module.exports = Router;
