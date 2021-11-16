// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { parse } from 'json2csv';
import { studioCors } from '@cors/studio';
import { RoleEnum } from '@enums';
import { Job } from '@models/jobs/job';
import Helpers from '@root/helpers';
import UserStudio from '@models/user_studio';
import Errors from '@root/errors';
import UserClient from '@models/user_client';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

interface JobsInterface {
  jobs: any[];
}

type PaginatedJobsResponse = express.Response<JobsInterface>;

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: PaginatedJobsResponse) => {
    const {
      artistUserId,
      brandId,
      classId,
      clientId,
      dateDueBefore,
      dateDueAfter,
      dateSearchIsForApprovals,
      projectIds,
      searchString,
      statusIds,
      studioId,
      submissionCount,
      csv,
      withModelDownloads,
    } = req.body;

    const scopes: Array<any> = csv ? ['jobSearchCSV'] : ['jobSearch'];
    const csvColumnNames = {
      ARTIST: 'Artist',
      AR_LINK: 'AR Link',
      BRAND: 'Brand',
      CLIENT: 'Client',
      DATE_ADDED: 'Date Added',
      DATE_DUE: 'Due Date',
      LAST_UPDATED: 'Last Updated',
      PART_NUMBER: 'Part Number',
      PURCHASE_ORDER: 'Purchase Order',
      PRODUCT_NAME: 'Product Names',
      QA_REVIEWER: 'QA Reviewer',
      STATUS: 'Status',
      SUBMISSIONS: 'Submissions',
      CLIENT_SUBMISSIONS: 'Client Submissions',
      WIDTH: 'Width',
      HEIGHT: 'Height',
      DEPTH: 'Depth',
      UNITS: 'Units',
      PRICE: 'Price',
    },
      roleIdToOmittedFieldsArray = (roleId: number): string[] => {
        switch (roleId) {
          case RoleEnum.CLIENT:
            return [csvColumnNames.ARTIST, csvColumnNames.QA_REVIEWER];
          default:
            return [];
        }
      };

    // Filters based on role
    switch (req.user?.primaryRoleId) {
      case RoleEnum.ARTIST:
        // Artists can only see their own jobs
        scopes.push({ method: ['forArtist', req.user.id] });
        break;
      case RoleEnum.CLIENT:
        // Clients can only see their own jobs, but Users can have more than one client
        const clientIds = await UserClient.getUserClientIds(req.user?.id);
        scopes.push({ method: ['forClients', clientIds] });
        break;
      case RoleEnum.STUDIO_ADMIN:
      case RoleEnum.QA:
        // QA role is now part of a studio and can see all jobs the studio has access to
        const studioIds = await UserStudio.getUserStudioIds(req.user?.id);
        scopes.push({ method: ['forStudios', studioIds] });
        break;
      case RoleEnum.ADMIN:
        // No job search restrictions for 3XR admins
        break;
    }

    if (artistUserId) {
      scopes.push({ method: ['forArtist', artistUserId] });
    }

    if (brandId) {
      scopes.push({ method: ['forBrand', brandId] });
    }

    if (classId) {
      scopes.push({ method: ['forClass', classId] });
    }

    if (clientId) {
      scopes.push({ method: ['forClient', clientId] });
    }

    if (dateSearchIsForApprovals) {
      if (dateDueAfter && dateDueBefore) {
        scopes.push({ method: ['updatedAtBetween', [dateDueAfter, dateDueBefore]] });
      } else if (dateDueAfter) {
        scopes.push({ method: ['updatedAtAfter', dateDueAfter] });
      } else if (dateDueBefore) {
        scopes.push({ method: ['updatedAtBefore', dateDueBefore] });
      }
    } else {
      if (dateDueAfter && dateDueBefore) {
        scopes.push({ method: ['dateDueBetween', [dateDueAfter, dateDueBefore]] });
      } else if (dateDueAfter) {
        scopes.push({ method: ['dateDueAfter', dateDueAfter] });
      } else if (dateDueBefore) {
        scopes.push({ method: ['dateDueBefore', dateDueBefore] });
      }
    }

    if (projectIds?.findIndex((e: number) => e == 0) == -1) {
      scopes.push({ method: ['withProjects', projectIds] });
    }

    if (statusIds?.findIndex((e: number) => e == 0) == -1) {
      // Search for specific status ids if the array does not have 0 (all)
      scopes.push({ method: ['withStatuses', statusIds] });
    }

    if (searchString) {
      if (searchString[0] == '-') {
        scopes.push({ method: ['searchExcludingProductName', searchString.substring(1)] });
      } else {
        scopes.push({ method: ['searchByProductName', searchString] });
      }
    }

    if (studioId) {
      scopes.push({ method: ['forStudios', [studioId]] });
    }

    if (withModelDownloads) {
      scopes.push('withModelDownloads');
    }

    if (csv) {
      // TODO: this could just go into the jobSearchCSV scope
      scopes.push('withDimensions');
    }

    Job.scope(scopes)
      .findAll()
      .then((jobs: any) => {
        if (submissionCount > -1) {
          // product.asset.submissions available in dashboard data, so just filter count here
          jobs = jobs.filter((job: any) => {
            if (submissionCount >= 10) {
              return job?.product?.asset?.submissions?.length >= submissionCount;
            } else {
              return job?.product?.asset?.submissions?.length == submissionCount;
            }
          });
        }
        if (csv) {
          // CSV Download
          const csvArray: Array<any> = [];
          let csvObj: any = {};
          for (let i = 0; i < jobs.length; i++) {
            // Get a 2D array of reviewers for all submissions
            let reviewers = jobs[i]?.product?.asset?.submissions.map(submission => {
              // Get an array of all reviewers for each issue
              return submission?.issues.map(issue => {
                return issue.author.fullName;
              });
            });
            // Convert the 2D array to 1D
            reviewers = [].concat(...reviewers);
            // Filter out duplicates
            reviewers = reviewers.filter((x: string, i: number, a: Array<string>) => a.indexOf(x) == i);
            const clientSubmissions = jobs[i]?.product?.asset?.submissions?.filter(item => {
              return item.hasReachedClient;
            });

            csvObj = {
              [csvColumnNames.ARTIST]: jobs[i]?.product?.artist?.fullName,
              [csvColumnNames.AR_LINK]:
                jobs[i]?.product?.asset?.submissions?.length > 0
                  ? 'https://view.3xr.com/' +
                  jobs[i]?.product?.asset?.uid +
                  '?s=' +
                  jobs[i]?.product?.asset?.submissions?.length
                  : '',
              [csvColumnNames.BRAND]: jobs[i]?.brand?.name,
              [csvColumnNames.CLIENT]: jobs[i]?.client?.name,
              [csvColumnNames.DATE_ADDED]: jobs[i]?.dateAdded,
              [csvColumnNames.DATE_DUE]: jobs[i]?.dateDue,
              [csvColumnNames.LAST_UPDATED]: jobs[i]?.lastUpdated,
              [csvColumnNames.PART_NUMBER]: jobs[i]?.product?.partNumber,
              [csvColumnNames.PRODUCT_NAME]: jobs[i]?.product?.name,
              [csvColumnNames.PURCHASE_ORDER]: jobs[i]?.project?.name,
              [csvColumnNames.QA_REVIEWER]: reviewers.join(', '),
              [csvColumnNames.STATUS]: jobs[i]?.status?.name,
              [csvColumnNames.SUBMISSIONS]: jobs[i]?.product?.asset?.submissions?.length,
              [csvColumnNames.CLIENT_SUBMISSIONS]: clientSubmissions?.length,
              [csvColumnNames.WIDTH]: jobs[i]?.product?.width,
              [csvColumnNames.HEIGHT]: jobs[i]?.product?.height,
              [csvColumnNames.DEPTH]: jobs[i]?.product?.depth,
              [csvColumnNames.UNITS]: jobs[i]?.product?.units?.name,
              [csvColumnNames.PRICE]: jobs[i]?.price,
            };

            csvObj = Helpers.dictionaryFilterEntries(csvObj, (key, _value) => {
              return req.user ? !roleIdToOmittedFieldsArray(req.user?.primaryRoleId).includes(key) : false;
            });

            csvArray.push(csvObj);
          }
          try {
            res.status(200).send(parse(csvArray, { fields: Object.keys(csvObj) }));
          } catch (err) {
            Errors.resJson(res, err as Error, 'Unable to send csv');
          }
        } else {
          res.json(jobs);
        }
      })
      .catch((e: Error) => {
        Errors.resJson(res, e, 'Unable to load jobs');
      });
  },
);

module.exports = Router;
