// SPDX-License-Identifier: Apache-2.0
import { AssetAttributes } from '3xr_types';
import AssetFile, { AssetFileInterface } from '@/store/interfaces/AssetFile';
import AssetSpinSet, { AssetSpinSetInterface } from '@/store/interfaces/AssetSpinSet';
import AssetSubmission, { AssetSubmissionInterface } from '@/store/interfaces/AssetSubmission';
import SequelizePicklist, { SequelizePicklistInterface } from '@/store/interfaces/common/SequelizePicklist';

export interface AssetInterface extends SequelizePicklistInterface, AssetAttributes {
  // children
  files: Array<AssetFileInterface>;
  spinSets: Array<AssetSpinSetInterface>;
  submissions: Array<AssetSubmissionInterface>;

  // computed
  primaryRender: string;

  // functions
  setFiles(files: Array<AssetFileInterface>): void;
  setSpinSets(spinSets: Array<AssetSpinSetInterface>): void;
  setSubmissions(submissions: Array<AssetSubmissionInterface>): void;
}

export default class Asset extends SequelizePicklist implements AssetInterface {
  // AssetAttributes
  allowDownload: boolean = false;
  cameraOrbit: string = '';
  cameraTarget: string = '';
  complexityId: number = 0;
  delete: boolean = false;
  hdr: string = '';
  name: string = '';
  published: boolean = false;
  rating: number = 0;
  showOptions: boolean = false;
  uid: string = '';

  // children
  files: Array<AssetFileInterface> = [];
  spinSets: Array<AssetSpinSetInterface> = [];
  submissions: Array<AssetSubmissionInterface> = [];

  // computed
  primaryRender: string = 'https://cdn.3xr.com/images/image_not_available.svg';

  constructor(data: any) {
    super(data); // id, name, createdAt, updatedAt
    if (data) {
      this.allowDownload = data.allowDownload;
      this.cameraOrbit = data.cameraOrbit;
      this.cameraTarget = data.cameraTarget;
      this.hdr = data.hdr;
      this.name = data.name;
      this.published = data.published;
      this.uid = data.uid;

      this.setFiles(data.files);
      this.setSpinSets(data.spinSets);
      this.setSubmissions(data.submissions);

      // Primary Render
      if (
        data.submissions &&
        data.submissions.length > 0 &&
        data.submissions[0].renders &&
        data.submissions[0].renders.length > 0
      ) {
        // To avoid wireframe renders, filter them out from the renders array
        const rendersWithoutWireframes = data.submissions[0].renders.filter((file: AssetFile) => {
          return file.filename.slice(-14) != '_wireframe.png';
        });
        this.primaryRender =
          'https://x.3xr.com/x/assets/' +
          data.uid +
          '/submissions/' +
          data.submissions.length +
          '/' +
          rendersWithoutWireframes[0].filename;
      } else {
        this.primaryRender = 'https://cdn.3xr.com/images/image_not_available.svg';
      }
    }
  }
  setFiles(files: Array<AssetFileInterface>) {
    this.files = [];
    if (files) {
      files.forEach((file: any) => {
        this.files.push(new AssetFile(file));
      });
    }
  }
  setSpinSets(spinSets: Array<AssetSpinSetInterface>) {
    this.spinSets = [];
    if (spinSets) {
      spinSets.forEach((spinSet: any) => {
        this.spinSets.push(new AssetSpinSet(spinSet));
      });
    }
  }
  setSubmissions(submissions: Array<AssetSubmissionInterface>) {
    this.submissions = [];
    if (submissions) {
      submissions.forEach((submission: any) => {
        this.submissions.push(new AssetSubmission(submission));
      });
    }
  }
}
