// SPDX-License-Identifier: Apache-2.0
import AssetSubmissionIssueCategoryType, {
  AssetSubmissionIssueCategoryTypeInterface,
} from './AssetSubmissionIssueCategoryType';

export interface AssetSubmissionIssueTypeInterface {
  category: AssetSubmissionIssueCategoryTypeInterface;
  categoryId: number;
  id: ASSET_SUBMISSION_ISSUE_TYPE;
  name: string;
  sortWeight: number;
}

export enum ASSET_SUBMISSION_ISSUE_TYPE {
  UNKNOWN = 0,
  // Product
  WRONG_PRODUCT,
  WRONG_OPTION,
  WRONG_COLOR,
  EXTRA_FEATURES,
  MISSING_FEATURES,
  INACCURATE_PROPORTIONS,
  PRODUCT_OTHER,
  // Model
  INCORRECT_DIMENSIONS,
  TOO_MANY_TRIANGLES,
  NOT_CENTERED,
  WRONG_ORIENTATION,
  INVERTED_NORMALS,
  NON_MANIFOLD_GEO,
  UNNECESSARY_GEO,
  MODEL_OTHER,
  // Textures
  MISSING_TEXTURES,
  LOW_RES_TEXTURES,
  UV_ISLAND_MARGIN_TOO_SMALL,
  BAD_UV_LAYOUT,
  BAD_DIFFUSE_MAP,
  BAD_NORMAL_MAP,
  BAD_AO_MAP,
  BAD_METALLIC_MAP,
  BAD_ROUGHNESS_MAP,
  TEXTURE_OTHER,
  // AR
  AR_SCALE,
  AR_PLACEMENT,
  AR_COLOR,
  AR_ARTIFACT,
  AR_OTHER,
}

export default class AssetSubmissionIssueType implements AssetSubmissionIssueTypeInterface {
  category: AssetSubmissionIssueCategoryTypeInterface = new AssetSubmissionIssueCategoryType(null);
  categoryId: number = 0;
  id: ASSET_SUBMISSION_ISSUE_TYPE = ASSET_SUBMISSION_ISSUE_TYPE.UNKNOWN;
  name: string = '';
  sortWeight: number = 0;

  constructor(data: any) {
    if (data) {
      this.category = new AssetSubmissionIssueCategoryType(data.category);
      this.categoryId = data.categoryId;
      this.id = data.id;
      this.name = data.name;
      this.sortWeight = data.sortWeight;
    }
  }

  static getPickList() {
    return [
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.WRONG_PRODUCT,
        name: 'Wrong Product',
        categoryId: 1,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.WRONG_OPTION,
        name: 'Wrong Option',
        categoryId: 1,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.WRONG_COLOR,
        name: 'Wrong Color',
        categoryId: 1,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.EXTRA_FEATURES,
        name: 'Extra Features',
        categoryId: 1,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.MISSING_FEATURES,
        name: 'Missing Features',
        categoryId: 1,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.INACCURATE_PROPORTIONS,
        name: 'Inaccurate Proportions',
        categoryId: 1,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.PRODUCT_OTHER,
        name: 'Other Product Issue',
        categoryId: 1,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.INCORRECT_DIMENSIONS,
        name: 'Incorrect Dimensions',
        categoryId: 2,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.TOO_MANY_TRIANGLES,
        name: 'Too Many Triangles',
        categoryId: 2,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.NOT_CENTERED,
        name: 'Not Centered',
        categoryId: 2,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.WRONG_ORIENTATION,
        name: 'Wrong Orientation',
        categoryId: 2,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.INVERTED_NORMALS,
        name: 'Inverted Normals',
        categoryId: 2,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.NON_MANIFOLD_GEO,
        name: 'Non-Manifold',
        categoryId: 2,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.UNNECESSARY_GEO,
        name: 'Unnecessary Parts',
        categoryId: 2,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.MODEL_OTHER,
        name: 'Other Model Issue',
        categoryId: 2,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.MISSING_TEXTURES,
        name: 'Missing Textures',
        categoryId: 3,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.LOW_RES_TEXTURES,
        name: 'Low Resolution Textures',
        categoryId: 3,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.UV_ISLAND_MARGIN_TOO_SMALL,
        name: 'UV Island Margin Too Small',
        categoryId: 3,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.BAD_UV_LAYOUT,
        name: 'Bad UV Layout',
        categoryId: 3,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.BAD_DIFFUSE_MAP,
        name: 'Bad Diffuse Map',
        categoryId: 3,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.BAD_NORMAL_MAP,
        name: 'Bad Normal Map',
        categoryId: 3,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.BAD_AO_MAP,
        name: 'Bad AO Map',
        categoryId: 3,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.BAD_METALLIC_MAP,
        name: 'Bad Metallic Map',
        categoryId: 3,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.BAD_ROUGHNESS_MAP,
        name: 'Bad Roughness Map',
        categoryId: 3,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.TEXTURE_OTHER,
        name: 'Other Texture Issue',
        categoryId: 3,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.AR_SCALE,
        name: 'AR Scale',
        categoryId: 4,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.AR_PLACEMENT,
        name: 'AR Placement',
        categoryId: 4,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.AR_COLOR,
        name: 'AR Color',
        categoryId: 4,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.AR_ARTIFACT,
        name: 'AR Artifact',
        categoryId: 4,
      }),
      new AssetSubmissionIssueType({
        id: ASSET_SUBMISSION_ISSUE_TYPE.AR_OTHER,
        name: 'Other AR Issue',
        categoryId: 4,
      }),
    ];
  }
}
