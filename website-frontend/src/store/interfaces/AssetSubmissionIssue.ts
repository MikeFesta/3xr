// SPDX-License-Identifier: Apache-2.0
import AssetSubmission, { AssetSubmissionInterface } from '@/store/interfaces/AssetSubmission';
import AssetSubmissionIssueImage from '@/store/interfaces/AssetSubmissionIssueImage';
import AssetSubmissionIssueHotspot from '@/store/interfaces/AssetSubmissionIssueHotspot';
import AssetSubmissionIssueType, {
  AssetSubmissionIssueTypeInterface,
} from '@/store/interfaces/types/AssetSubmissionIssueType';
import User, { UserInterface } from '@/store/interfaces/User';
import { USER_ROLE_TYPE } from './types/UserRoleType';

export interface AssetSubmissionIssueInterface {
  assetSubmissionId: number;
  assetSubmission: AssetSubmissionInterface;
  authorUserId: number;
  authorRoleId: USER_ROLE_TYPE;
  author: UserInterface;
  createdAt: string;
  deleted: boolean;
  description: string;
  hotspots: Array<AssetSubmissionIssueHotspot>;
  id: number;
  images: Array<AssetSubmissionIssueImage>;
  issueTypeId: number;
  resolved: boolean;
  resolutionTime: string;
  response: string;
  type: AssetSubmissionIssueTypeInterface;
  updatedAt: string;
}

export default class AssetSubmissionIssue implements AssetSubmissionIssueInterface {
  assetSubmissionId: number = 0;
  assetSubmission: AssetSubmissionInterface = new AssetSubmission(null);
  authorUserId: number = 0;
  authorRoleId: USER_ROLE_TYPE = USER_ROLE_TYPE.UNKNOWN;
  author: UserInterface = new User(null);
  createdAt: string = '';
  deleted: boolean = false;
  description: string = '';
  hotspots: Array<AssetSubmissionIssueHotspot> = [];
  id: number = 0;
  images: Array<AssetSubmissionIssueImage> = [];
  issueTypeId: number = 0;
  resolved: boolean = false;
  response: string = '';
  resolutionTime: string = '';
  type: AssetSubmissionIssueTypeInterface = new AssetSubmissionIssueType(null);
  updatedAt: string = '';

  constructor(data: any) {
    if (data) {
      this.assetSubmissionId = data.assetSubmissionId;
      this.assetSubmission = new AssetSubmission(data.assetSubmission);
      this.authorUserId = data.authorUserId;
      this.author = new User(data.author);
      this.authorRoleId = data.authorRoleId;
      this.createdAt = data.createdAt;
      this.deleted = data.deleted;
      this.description = data.description;
      this.setHotspots(data.hotspots);
      this.id = data.id;
      this.issueTypeId = data.issueTypeId;
      this.setImages(data.images);
      this.resolved = data.resolved;
      this.resolutionTime = data.resolutionTime || data.updatedAt;
      this.response = data.response;
      this.type = new AssetSubmissionIssueType(data.type);
      this.updatedAt = data.updatedAt;
    }
  }
  setHotspots(hotspots: Array<AssetSubmissionIssueHotspot>) {
    this.hotspots = [];
    if (hotspots) {
      hotspots.forEach((hotspot: AssetSubmissionIssueHotspot) => {
        this.hotspots.push(new AssetSubmissionIssueHotspot(hotspot));
      });
    }
  }
  setImages(images: Array<AssetSubmissionIssueImage>) {
    //this.images = this.images.map(image => {new AssetSubmissionIssueImage(image)});
    // typescript is making it hard to use .map()
    this.images = [];
    if (images) {
      images.forEach((image: AssetSubmissionIssueImage) => {
        this.images.push(new AssetSubmissionIssueImage(image));
      });
    }
  }
}
