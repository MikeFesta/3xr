// SPDX-License-Identifier: Apache-2.0
import Client, { ClientInterface } from '@/store/interfaces/Client';
import ClientBrand, { ClientBrandInterface } from '@/store/interfaces/ClientBrand';
import ClientClass, { ClientClassInterface } from '@/store/interfaces/ClientClass';
import Job, { JobInterface } from '@/store/interfaces/Job';
import UnitType, { UnitTypeInterface } from '@/store/interfaces/types/UnitType';
import JobQualityType, { JobQualityTypeInterface } from '@/store/interfaces/types/JobQualityType';
import JobPriorityType, { JobPriorityTypeInterface } from '@/store/interfaces/types/JobPriorityType';
import ProjectStatusType, { ProjectStatusTypeInterface } from '@/store/interfaces/types/ProjectStatusType';
import Studio, { StudioInterface } from '@/store/interfaces/Studio';
import User, { UserInterface } from '@/store/interfaces/User';

export interface ProjectInterface {
  artist: UserInterface;
  brand: ClientBrandInterface;
  class: ClientClassInterface;
  client: ClientInterface;
  createdAt: string;
  dateAdded: string; // Computed
  dateCompleted: string;
  dateDue: string;
  defaultPrice: number;
  id: number;
  jobCount: number;
  jobs: Array<JobInterface>;
  priority: JobPriorityTypeInterface;
  name: string;
  quality: JobQualityTypeInterface;
  status: ProjectStatusTypeInterface;
  studio: StudioInterface;
  uid: string;
  units: UnitTypeInterface;
  updatedAt: string;
  updatedAtDate: Date;
  isCreatedFromHolding: boolean;
  setJobs(jobs: Array<JobInterface>): void;
  updatePicklists(): void;
}

export default class Project implements ProjectInterface {
  artist: UserInterface = new User(null);
  brand: ClientBrandInterface = new ClientBrand(null);
  class: ClientClassInterface = new ClientClass(null);
  client: ClientInterface = new Client(null);
  createdAt: string = '';
  dateAdded: string = ''; // computed
  dateCompleted: string = '';
  dateDue: string = '';
  defaultPrice: number = 0;
  id: number = 0;
  jobCount: number = 0;
  jobs: Array<JobInterface> = [];
  priority: JobPriorityTypeInterface = new JobPriorityType(null);
  name: string = '';
  quality: JobQualityTypeInterface = new JobQualityType(null);
  status: ProjectStatusTypeInterface = new ProjectStatusType(null);
  studio: StudioInterface = new Studio(null);
  uid: string = '';
  units: UnitTypeInterface = new UnitType(null);
  updatedAt: string = '';
  updatedAtDate: Date = new Date();
  isCreatedFromHolding: boolean = false;
  constructor(data: any) {
    if (data) {
      this.artist = new User(data.artist);
      this.brand = new ClientBrand(data.brand);
      this.class = new ClientClass(data.class);
      this.client = new Client(data.client);
      this.createdAt = data.createdAt;
      if (this.createdAt) {
        this.dateAdded = this.createdAt.split('T')[0];
      }
      this.dateCompleted = data.dateCompleted;
      this.dateDue = data.dateDue;
      this.defaultPrice = data.defaultPrice;
      this.id = data.id;
      this.jobCount = data.jobCount;
      this.setJobs(data.jobs);
      this.priority = new JobPriorityType(data.priority);
      this.name = data.name;
      this.quality = new JobQualityType(data.quality);
      this.status = new ProjectStatusType(data.status);
      this.studio = new Studio(data.studio);
      this.uid = data.uid;
      this.units = new UnitType(data.units);
      this.updatedAt = data.updatedAt;
      this.isCreatedFromHolding = !!data.isCreatedFromHolding;
      if (this.updatedAt) {
        this.updatedAtDate = new Date(this.updatedAt);
      }
    }
  }
  setJobs(jobs: Array<JobInterface>) {
    this.jobs = [];
    if (jobs) {
      jobs.forEach((job: any) => {
        this.jobs.push(new Job(job));
      });
    }
  }
  updatePicklists() {
    // Update the names for picklist classes based on the current id, which may have been changed
    // This is to address the way that form select elements use the id as the v-model
    //this.brand.updateNameFromId(this.client.brands);
    //this.class.updateNameFromId(this.client.classes);
    //this.priority.updateNameFromId(JobPriorityType.getPickList());
    //this.quality.updateNameFromId(JobQualityType.getPickList());
    this.units.updateNameFromId(UnitType.getPickList());
  }
}
