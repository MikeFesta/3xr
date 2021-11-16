// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { AssetAttributes } from '3xr_types';
import { compare } from 'bcryptjs';
import { AssetMetricTypeEnum, TextureTypeEnum } from '@enums';
import { Asset } from '@models/asset';
import { AssetMetric } from '@models/asset_metric';
import { studioCors } from '@cors/studio';
import errors from '@root/errors';
import helpers from '@root/helpers';
const Router = express.Router();

Router.options('/', studioCors);

// Note that this route is reached from https://view.3xr.com/
// But it can be reached from https://qr.3xr.com and https://embed.3xr.com

const getApplePayUrlData = function (asset: AssetAttributes): string {
  let data = '';
  if (asset.showBanner) {
    data = '&custom=https://www.3xr.com/a/asset/banner/' + asset.uid;
  }
  return data;
};

const getCombinations = async (asset: AssetAttributes) => {
  let combinations: any = [];
  if (asset.showOptions) {
    const productCombinations = await Asset.scope({ method: ['combinations', asset.uid] }).findOne();
    if ((productCombinations?.product?.combinations?.length || 0) > 0) {
      combinations = productCombinations?.product?.combinations?.map(result => {
        const diffuse = result.asset?.textures?.filter(texture => {
          return texture.textureTypeId == TextureTypeEnum.DIFFUSE;
        });
        if (diffuse && diffuse.length > 0) {
          return {
            color: diffuse[0].color,
            diffuseFilename:
              'https://cdn.3xr.com/models/' +
              result.asset?.uid +
              '/' +
              diffuse[0].filename +
              '_2k_diffuse.' +
              diffuse[0].extension?.name,
            qr: 'https://cdn.3xr.com/models/' + result?.asset?.uid + '/qr-' + result?.asset?.name + '.png',
            usdz: 'https://cdn.3xr.com/models/' + result?.asset?.uid + '/' + result?.asset?.name + '.usdz',
          };
        }
      });
    }
  }
  return combinations;
}

const viewAsset = async (req: express.Request, res: express.Response) => {
  let customerUid: string = typeof req.query.user === 'string' ? req.query.user : '';
  // Note: customer UID is optional
  if (!customerUid) {
    // If not passed, check if they are logged in and record that id
    customerUid = req.user?.id ? req.user?.id.toString() : '';
  }
  const viewerSessionUid = helpers.getRandomString(32);
  try {
    const asset = await Asset.scope('viewer').findOne({
      where: { uid: req.params.assetUid },
    });
    if (!asset) {
      await AssetMetric.create({
        abId: null,
        assetUid: req.params.assetUid,
        cameraEngagement: 0,
        customerUid,
        deviceTypeId: null, // not available here (will be sent by js callbacks)
        ipAddress: req.ip,
        metricTypeId: AssetMetricTypeEnum.ERROR,
        notes: 'Unable to find model on view.ts',
        sessionTimeMs: 0,
        sessionUid: req.sessionID || null,
        source: (req.query.src as string) || null, // qr, embed
        url: req.headers['referer'] as string,
        userAgent: req.headers['user-agent'] || null,
        viewerSessionUid,
      });
      res.render('error', { error_message: 'Unable to find 3D Model' });
    } else {
      // Note: for QA the password could be set to something for internal use, then changed by the customer on publish
      let passwordCheckFailed = false;
      if (asset?.passwordHash) {
        // Asset Requires a password
        if (!req.body?.password) {
          // No password provided
          passwordCheckFailed = true;
        } else {
          // Check hash using bcrypt
          passwordCheckFailed = !(await compare(req.body?.password || '', asset?.passwordHash));
        }
      }
      if (passwordCheckFailed) {
        res.render('asset/password', { invalid: req.body?.password != undefined });
      } else {
        let abId: number | null = null;
        // Pick an AB varient randomly (if any exist)
        if (asset.abAlteratives?.length) {
          const assetProbabilityWeight = asset?.probabilityWeight || 1;
          // Add up the total weight and select a number in that range
          const totalOutcomes =
            assetProbabilityWeight +
            asset.abAlteratives.map(el => el.probabilityWeight).reduce((acc, weight) => acc + weight);
          let randomValue = Math.floor(Math.random() * totalOutcomes);
          // Only pick an alternative if the random number is greater than using the default values
          if (randomValue >= assetProbabilityWeight) {
            randomValue = randomValue - assetProbabilityWeight;
            let abIndex = 0;
            while (
              abIndex < asset.abAlteratives.length &&
              randomValue >= asset.abAlteratives[abIndex].probabilityWeight
            ) {
              // Looking for a match in the range of each weighted probability
              // ex) [original value (weight 1)] [Option B (weight 2)] [Option C (weight 1)]
              // Total Outcomes = 4 (random value is 0-3)
              // Choose original value if random is 0
              // Choose Option B if random is 1 or 2
              // Choose Option C if random is 3
              randomValue = randomValue - asset.abAlteratives[abIndex].probabilityWeight;
              abIndex++;
            }
            const abResult = asset.abAlteratives[abIndex];
            abId = abResult.id;

            // override asset values from the alternative (if not null)
            if (abResult.bannerButtonText) {
              asset.bannerButtonText = abResult.bannerButtonText;
            }
            if (abResult.cameraOrbit) {
              asset.cameraOrbit = abResult.cameraOrbit;
            }
            if (abResult.cameraTarget) {
              asset.cameraTarget = abResult.cameraTarget;
            }
            if (abResult.hdr) {
              asset.hdr = abResult.hdr;
            }
            if (abResult.probabilityWeight) {
              asset.probabilityWeight = abResult.probabilityWeight;
            }
            if (abResult.productName) {
              asset.productName = abResult.productName;
            }
            if (abResult.productPrice) {
              asset.productPrice = abResult.productPrice;
            }
            if (abResult.productSubtitle) {
              asset.productSubtitle = abResult.productSubtitle;
            }
            if (abResult.productUrl) {
              asset.productUrl = abResult.productUrl;
            }
            if (abResult.showBanner) {
              asset.showBanner = abResult.showBanner;
            }
            if (abResult.showOptions) {
              asset.showOptions = abResult.showOptions;
            }
          }
        }
        // Log Metrics for Page Request
        await AssetMetric.create({
          abId,
          assetUid: req.params.assetUid,
          cameraEngagement: 0,
          customerUid,
          deviceTypeId: null, // not available here (will be sent by js callbacks)
          ipAddress: req.ip,
          metricTypeId: AssetMetricTypeEnum.PAGE_REQUEST,
          sessionTimeMs: 0,
          sessionUid: req.sessionID || null,
          source: (req.query.src as string) || null, // qr, embed
          url: req.headers['referer'] as string,
          userAgent: req.headers['user-agent'] || null,
          viewerSessionUid,
        });
        let url = 'https://cdn.3xr.com/models/' + asset.uid + '/' + asset.name;
        if (req.query.s) {
          // Load a specific submission (preview)
          url = 'https://x.3xr.com/x/assets/' + asset.uid + '/submissions/' + req.query.s + '/' + asset.name;
        }

        res.render('asset/view', {
          abId,
          applePayUrlData: getApplePayUrlData(asset),
          backgroundColor: req.query.bg || 'fff',
          combinations: await getCombinations(asset),
          corsCacheBust: 'view',
          customerUid,
          embed: req.query.src == 'embed',
          environmentImage: 'https://cdn.3xr.com/images/hdr/' + asset.hdr + '_1k.hdr',
          exposure: asset.exposure || 0.8,
          imageUrl: 'https://cdn.3xr.com/models/' + asset.uid + '/' + asset.name + '-thumbnail-1920.jpg',
          interactionPolicy: req.query.src == 'embed' ? 'allow-when-focused' : 'always-allow',
          logoUrl:
            req.query.src == 'embed'
              ? 'https://cdn.3xr.com/images/3xr-gray50.svg'
              : 'https://cdn.3xr.com/images/3xr.svg',
          name: asset.productName || asset.name,
          nologo: req.query.nologo,
          orbit: asset.cameraOrbit,
          productButtonText: asset.bannerButtonText || 'Visit Website',
          productTitle: asset.productName || asset.name,
          productSubtitle: asset.productSubtitle,
          productPrice: (asset.productSubtitle && asset.productPrice ? ',' : '') + asset.productPrice || '',
          productUrl: asset.productUrl,
          productUrlDomain: helpers.parseDomain(asset.productUrl || '3xr.com'),
          session: req.sessionID,
          shadowIntensity: asset.shadowIntensity || 0.8,
          showBanner: asset.showBanner,
          target: asset.cameraTarget,
          uid: asset.uid,
          url,
          viewerSessionUid,
          qrUrl: 'https://cdn.3xr.com/models/' + asset.uid + '/qr-' + asset.name + '.png',
        });
      }
    }
  } catch {
    await AssetMetric.create({
      abId: null,
      assetUid: req.params.assetUid,
      cameraEngagement: 0,
      customerUid,
      deviceTypeId: null, // not available here (will be sent by js callbacks)
      ipAddress: req.ip,
      metricTypeId: AssetMetricTypeEnum.ERROR,
      notes: 'Catch error on view.ts',
      sessionTimeMs: 0,
      sessionUid: req.sessionID || null,
      source: (req.query.src as string) || null, // qr, embed
      url: req.headers['referer'] as string,
      userAgent: req.headers['user-agent'] || null,
      viewerSessionUid,
    });
    res.render('error', { error_message: 'Unable to load 3D Model' });
  }
};

Router.post('/:assetUid', async (req: express.Request, res: express.Response) => {
  // Post is for providing a password for a protected asset
  res.removeHeader('X-Frame-Options');
  await viewAsset(req, res);
});

Router.get('/:assetUid', async (req: express.Request, res: express.Response) => {
  res.removeHeader('X-Frame-Options');
  await viewAsset(req, res);
});

Router.post('/', studioCors, async (req: express.Request, res: express.Response) => {
  // AJAX endpoint for embed.html
  if (!req.body.assetUid) {
    errors.resJsonWithCode(res, null, 'Invalid Request', 400);
  } else {
    console.log(req.body.interactionDelay); // TODO: save this to the asset_metrics table
    const asset = await Asset.scope('viewer').findOne({
      where: { uid: req.body.assetUid },
    });
    if (!asset) {
      errors.resJsonWithCode(res, null, '3D model not found', 404);
    } else {
      res.json({
        abId: 'TODO',
        applePayUrlData: getApplePayUrlData(asset),
        combinations: await getCombinations(asset),
        environmentImage: 'https://cdn.3xr.com/images/hdr/' + asset.hdr + '_1k.hdr',
        exposure: asset.exposure || 0.8,
        imageUrl: 'https://cdn.3xr.com/models/' + asset.uid + '/' + asset.name + '-thumbnail-1920.jpg',
        orbit: asset.cameraOrbit,
        productButtonText: asset.bannerButtonText || 'Visit Website',
        productTitle: asset.productName || asset.name,
        productSubtitle: asset.productSubtitle,
        productPrice: (asset.productSubtitle && asset.productPrice ? ',' : '') + asset.productPrice || '',
        productUrl: asset.productUrl,
        productUrlDomain: helpers.parseDomain(asset.productUrl || '3xr.com'),
        session: req.sessionID,
        shadowIntensity: asset.shadowIntensity || 0.8,
        showBanner: asset.showBanner,
        target: asset.cameraTarget,
        uid: asset.uid,
        url: 'https://cdn.3xr.com/models/' + asset.uid + '/' + asset.name,
        viewerSessionUid: helpers.getRandomString(32), // TODO: if recording metrics, include this and generate it upstream
        qrUrl: 'https://cdn.3xr.com/models/' + asset.uid + '/qr-' + asset.name + '.png',
      });
    }
  }
});

module.exports = Router;
