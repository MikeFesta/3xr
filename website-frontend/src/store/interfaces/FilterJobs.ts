// SPDX-License-Identifier: Apache-2.0
export interface FilterJobsInterface {
  artistUserId: number;
  brandId: number;
  classId: number;
  clientId: number;
  dateDueBefore: string;
  dateDueAfter: string;
  dateSearchIsForApprovals: boolean;
  projectIds: number[];
  resultsPerPage: number;
  searchString: string;
  statusIds: number[];
  studioId: number;
  submissionCount: number; // this may end up being a range or have a > = < condition
  withModelDownloads: boolean;
}

export default class FilterJobs implements FilterJobsInterface {
  artistUserId: number = 0;
  brandId: number = 0;
  classId: number = 0;
  clientId: number = 0;
  dateDueBefore: string = '';
  dateDueAfter = '';
  dateSearchIsForApprovals: boolean = false;
  projectIds: number[] = [0];
  resultsPerPage: number = 15;
  searchString: string = '';
  statusIds: number[] = [0];
  studioId: number = 0;
  submissionCount: number = -1;
  withModelDownloads: boolean = false;

  // This data will be passed by URL or filters selected in the UI
  constructor(data: any) {
    if (data) {
      if (data.artistUserId) {
        this.artistUserId = parseInt(data.artistUserId);
      }
      if (data.brandId) {
        this.brandId = parseInt(data.brandId);
      }
      if (data.classId) {
        this.classId = parseInt(data.classId);
      }
      if (data.clientId) {
        this.clientId = parseInt(data.clientId);
      }
      if (data.dateDueBefore) {
        this.dateDueBefore = data.dateDueBefore;
      }
      if (data.dateDueAfter) {
        this.dateDueAfter = data.dateDueAfter;
      }
      if (data.poId) {
        // In the url, store project filter ids as poId
        if (isNaN(data.poId)) {
          // multiple ids
          this.projectIds = data.poId.split('-').map((e: string) => parseInt(e));
        } else {
          this.projectIds = [parseInt(data.poId)];
        }
      }
      if (data.projectIds) {
        this.projectIds = data.projectIds;
      }
      if (data.resultsPerPage) {
        this.resultsPerPage = parseInt(data.resultsPerPage);
      }

      if (data.s) {
        // searchString is stored in the url as s=
        this.searchString = decodeURIComponent(data.s);
      }
      if (data.searchString) {
        this.searchString = data.searchString;
      }
      if (data.statusId) {
        // Status Id(s) from the URL. Did not rename the variable to preserve old links
        if (isNaN(data.statusId)) {
          // String with mulitple status ids
          this.statusIds = data.statusId.split('-').map((e: string) => parseInt(e));
        } else {
          // Single status id
          this.statusIds = [parseInt(data.statusId)];
        }
      }
      if (data.statusIds) {
        // this data is already an array (compared to data.statusId, which comes from the url)
        if (this.statusIds.length > 0) {
          this.statusIds = data.statusIds;
        } else {
          this.statusIds = [0]; // default to "All"
        }
      }
      if (data.studioId) {
        this.studioId = parseInt(data.studioId);
      }
      if (data.submissionCount) {
        this.submissionCount = parseInt(data.submissionCount);
      }
      if (data.withModelDownloads) {
        this.withModelDownloads = data.withModelDownloads;
      }
    }
  }
}
