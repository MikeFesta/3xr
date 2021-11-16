// SPDX-License-Identifier: Apache-2.0
import Asset, { AssetInterface } from '@/store/interfaces/Asset';
import AssetSubmissionIssue, { AssetSubmissionIssueInterface } from '@/store/interfaces/AssetSubmissionIssue';
import AssetSubmissionRender, { AssetSubmissionRenderInterface } from '@/store/interfaces/AssetSubmissionRender';
import AssetSubmissionStatus, { AssetSubmissionStatusInterface } from '@/store/interfaces/AssetSubmissionStatus';
import AssetSubmissionTexture, { AssetSubmissionTextureInterface } from '@/store/interfaces/AssetSubmissionTexture';
import { formatDateMMDDYYYY, formatDateMMDDYYYYHHMM } from '@/helpers';
import UnitType, { UnitTypeInterface } from '@/store/interfaces/types/UnitType';
import User, { UserInterface } from '@/store/interfaces/User';

export interface AssetSubmissionInterface {
  artist: UserInterface;
  asset: AssetInterface; // Only pass uid here to avoid a circular dependency (uid needed for texture src)
  createdAt: string;
  createdAtFormatted: string; // Computed
  dateSubmitted: string; // Computed
  dateAndTimeSubmitted: string; // Computed
  depth: number;
  depthInMeters: number; // Computed
  folder: string;
  hasReachedClient: boolean;
  height: number;
  heightInMeters: number; // Computed
  id: number;
  lightCount: number;
  openIssues: Array<AssetSubmissionIssueInterface>;
  primaryRenderSrc: string;
  renders: Array<AssetSubmissionRender>;
  resolvedIssues: Array<AssetSubmissionIssueInterface>;
  submissionNumber: number;
  submissionNumberWithDate: string; // Computed
  status: AssetSubmissionStatusInterface;
  textures: Array<AssetSubmissionTextureInterface>;
  triangleCount: number;
  units: UnitTypeInterface;
  updatedAt: string;
  width: number;
  widthInMeters: number; // Computed
  setOpenIssues(issues: Array<AssetSubmissionIssueInterface>): void; // TODO: Currently have a bug where this is non-zero with nulls when it should be empty
  setResolvedIssues(issues: Array<AssetSubmissionIssueInterface>): void;
  setStatusFromIndex(index: number): void;
  setTextures(textures: Array<AssetSubmissionTextureInterface>): void;
  setPrimaryRenderSrc(renders: Array<AssetSubmissionRenderInterface>): void;
}

export default class AssetSubmission implements AssetSubmissionInterface {
  artist: UserInterface = new User(null);
  asset: AssetInterface = new Asset(null);
  createdAt: string = '';
  createdAtFormatted: string = '';
  dateSubmitted: string = '';
  dateAndTimeSubmitted: string = '';
  depth: number = 0;
  depthInMeters: number = 0;
  folder: string = '';
  hasReachedClient: boolean = false;
  height: number = 0;
  heightInMeters: number = 0;
  id: number = 0;
  lightCount: number = 0;
  openIssues: Array<AssetSubmissionIssueInterface> = [];
  primaryRenderSrc: string = '';
  renders: Array<AssetSubmissionRender> = [];
  resolvedIssues: Array<AssetSubmissionIssueInterface> = [];
  submissionNumber: number = 0;
  submissionNumberWithDate: string = '';
  status: AssetSubmissionStatusInterface = new AssetSubmissionStatus(null);
  textures: Array<AssetSubmissionTextureInterface> = [];
  triangleCount: number = 0;
  units: UnitTypeInterface = new UnitType(null);
  updatedAt: string = '';
  width: number = 0;
  widthInMeters: number = 0;

  constructor(data: any) {
    if (data) {
      this.artist = new User(data.artist);
      this.asset = new Asset(data.asset);
      this.createdAt = data.createdAt;
      this.createdAtFormatted = formatDateMMDDYYYYHHMM(data.createdAt);
      this.updatedAt = data.updatedAt;
      this.dateSubmitted = formatDateMMDDYYYY(data.createdAt);
      this.dateAndTimeSubmitted = this.createdAtFormatted;
      this.depth = data.depth;
      this.folder = data.folder;
      this.hasReachedClient = data.hasReachedClient;
      this.height = data.height;
      this.id = data.id;
      this.lightCount = data.lightCount;
      this.setOpenIssues(data.openIssues);
      this.renders = data.renders;
      this.setResolvedIssues(data.resolvedIssues);
      this.submissionNumber = data.submissionNumber;
      // Number with Data (for dropdown)
      this.submissionNumberWithDate = 'Round ' + this.submissionNumber + ' ' + this.dateAndTimeSubmitted;
      this.status = new AssetSubmissionStatus(data.status);
      this.setTextures(data.textures);
      this.triangleCount = data.triangleCount;
      this.units = new UnitType(data.units);
      this.width = data.width;

      // Compute units in meters
      this.depthInMeters = this.units.convertToMeters(data.depth);
      this.heightInMeters = this.units.convertToMeters(data.height);
      this.widthInMeters = this.units.convertToMeters(data.width);

      // Additional computations
      if (data.renders) {
        this.setPrimaryRenderSrc(data.renders);
      }
    }
  }
  setOpenIssues(issues: Array<AssetSubmissionIssueInterface>) {
    this.openIssues = [];
    if (issues) {
      issues.forEach((issue: AssetSubmissionIssueInterface) => {
        this.openIssues.push(new AssetSubmissionIssue(issue));
      });
    }
  }
  setPrimaryRenderSrc(renders: Array<AssetSubmissionRenderInterface>) {
    if (renders.length == 0) {
      this.primaryRenderSrc = 'https://cdn.3xr.com/images/image_not_available.svg';
    } else {
      this.primaryRenderSrc =
        'https://x.3xr.com/x/assets/' +
        this.asset.uid +
        '/submissions/' +
        this.submissionNumber +
        '/' +
        renders[0].filename;
    }
  }
  setResolvedIssues(issues: Array<AssetSubmissionIssueInterface>) {
    this.resolvedIssues = [];
    if (issues) {
      issues.forEach((issue: AssetSubmissionIssueInterface) => {
        this.resolvedIssues.push(new AssetSubmissionIssue(issue));
      });
    }
  }
  setStatusFromIndex(index: number) {
    this.status.setFromIndex(index);
  }
  setTextures(textures: Array<AssetSubmissionTextureInterface>) {
    this.textures = [];
    if (textures && this.asset) {
      textures.forEach((texture: any) => {
        this.textures.push(new AssetSubmissionTexture(texture, this.asset.uid, this.submissionNumber));
      });
    }
  }
}
