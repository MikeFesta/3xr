// SPDX-License-Identifier: Apache-2.0
export enum JobStatusTypes {
  UNASSIGNED = 1, // On Job Initialization
  ASSIGNED = 2, // TODO: Make sure this is explicitly set
  IN_PROGRESS = 3, // record_zip_download, check_for_update
  SELF_QA = 4, // set_submission_status (when processing step 17 is triggered)
  TECHNICAL_QA = 5, // submit_for_qa
  REVISION_NEEDED = 6, // needs_technical_revision
  IN_REWORK = 7, // check_for_update
  CLIENT_QA = 8, // approve_technical comment, but not active
  COMPLETE = 9, //14,   // in approve_technical for now
  CANCELLED = 10, //15, // TODO: No way to get here (cancel button needed)
}
