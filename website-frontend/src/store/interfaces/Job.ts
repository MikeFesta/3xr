// SPDX-License-Identifier: Apache-2.0
import Client, { ClientInterface } from '@/store/interfaces/Client';
import ClientBrand, { ClientBrandInterface } from '@/store/interfaces/ClientBrand';
import ClientClass, { ClientClassInterface } from '@/store/interfaces/ClientClass';
import JobStatusType, { JobStatusTypeInterface, JOB_STATUS_TYPE } from '@/store/interfaces/types/JobStatusType';
import JobPriorityType, { JobPriorityTypeInterface } from '@/store/interfaces/types/JobPriorityType';
import JobQualityType, { JobQualityTypeInterface } from '@/store/interfaces/types/JobQualityType';
import Product, { ProductInterface } from '@/store/interfaces/Product';
import Project from '@/store/interfaces/Project';
import Studio, { StudioInterface } from '@/store/interfaces/Studio';

export interface JobStatusDataInterface {
  color: string;
  link: string;
  text: string;
}
export interface JobInterface {
  additionalDimensions: string;
  billingMonth: number;
  billingPlatformCharge: number;
  brand: ClientBrandInterface;
  class: ClientClassInterface;
  client: ClientInterface;
  clientId?: number;
  createdAt: string;
  dateAdded: string; // Computed
  dateCompleted: string;
  dateDue: string;
  materialInformation: string;
  modelingInstructions: string;
  notes: string;
  paid3xr: boolean;
  paidStudio: boolean;
  price: number;
  project: Project;
  prority: JobPriorityTypeInterface;
  product: ProductInterface;
  status: JobStatusTypeInterface;
  studio: StudioInterface;
  quality: JobQualityTypeInterface;
  uid: string;
  updatedAt: string;
  statusData: JobStatusDataInterface;
}

export interface JobSelected {
  job: JobInterface;
  selected: boolean;
}

export interface JobUpdateInterface {
  additionalDimensions: string;
  asin: string;
  brandId: number;
  classId: number;
  clientId?: number;
  depth?: number;
  dateDue: string;
  height?: number;
  materialInformation: string;
  modelingInstructions: string;
  name: string;
  notes: string;
  partNumber: string;
  price: number;
  priorityId: number;
  projectUid: string;
  jobUid: string;
  url: string;
  unitTypeId: number;
  qualityId: number;
  studioId: number;
  units?: number;
  width?: number;
}

function getStatusData(job: JobInterface): JobStatusDataInterface {
  switch (job.status.id) {
    case JOB_STATUS_TYPE.UNASSIGNED:
      return { color: 'orange', link: `/product/details/${job.product.uid}`, text: 'Product Details' };
    case JOB_STATUS_TYPE.ASSIGNED:
      return { color: 'orange', link: `/product/details/${job.product.uid}`, text: 'Product Details' };
    case JOB_STATUS_TYPE.IN_PROGRESS:
      return { color: 'light_blue', link: `/product/details/${job.product.uid}`, text: 'Product Details' };
    case JOB_STATUS_TYPE.SELF_QA:
      return { color: 'light_blue', link: `/product/review/${job.product.uid}`, text: 'Review Model' };
    case JOB_STATUS_TYPE.TECHNICAL_QA:
      return { color: 'green', link: `/product/review/${job.product.uid}`, text: 'Review Model' };
    case JOB_STATUS_TYPE.REVISION_NEEDED:
      return { color: 'orange', link: `/product/review/${job.product.uid}`, text: 'Review Model' };
    case JOB_STATUS_TYPE.IN_REWORK:
      return { color: 'light_blue', link: `/product/review/${job.product.uid}`, text: 'Review Model' };
    case JOB_STATUS_TYPE.CLIENT_QA:
      return { color: 'green', link: `/product/review/${job.product.uid}`, text: 'Review Model' };
    case JOB_STATUS_TYPE.COMPLETE:
      return { color: 'green', link: `/asset/details/${job.product.asset.uid}`, text: 'Final Assets' };
    case JOB_STATUS_TYPE.CANCELLED:
    default:
      return { color: 'red', link: `/product/details/${job.product.uid}`, text: 'Product Details' };
  }
}

export default class Job implements JobInterface {
  additionalDimensions: string = '';
  billingMonth: number = -1;
  billingPlatformCharge: number = 0;
  brand: ClientBrandInterface = new ClientBrand(null);
  class: ClientClassInterface = new ClientClass(null);
  client: ClientInterface = new Client(null);
  clientId: number = 0;
  createdAt: string = '';
  dateAdded: string = '';
  dateCompleted: string = '';
  dateDue: string = '';
  materialInformation: string = '';
  modelingInstructions: string = '';
  notes: string = '';
  paid3xr: boolean = false;
  paidStudio: boolean = false;
  price: number = 0;
  project: Project = new Project(null);
  prority: JobPriorityTypeInterface = new JobPriorityType(null);
  product: ProductInterface = new Product(null);
  status: JobStatusTypeInterface = new JobStatusType(null);
  studio: StudioInterface = new Studio(null);
  quality: JobQualityTypeInterface = new JobQualityType(null);
  uid: string = '';
  updatedAt: string = '';
  statusData: JobStatusDataInterface = { color: '', link: '', text: '' };

  constructor(data: any) {
    if (data) {
      this.additionalDimensions = data.additionalDimensions;
      this.billingMonth = data.billingMonth;
      this.billingPlatformCharge = data.billingPlatformCharge;
      this.brand = new ClientBrand(data.brand);
      this.class = new ClientClass(data.class);
      this.client = new Client(data.client);
      this.clientId = data.clientId;
      this.createdAt = data.createdAt;
      if (this.createdAt) {
        this.dateAdded = this.createdAt.split('T')[0];
      }
      this.dateCompleted = data.dateCompleted;
      this.dateDue = data.dateDue;
      this.materialInformation = data.materialInformation;
      this.modelingInstructions = data.modelingInstructions;
      this.notes = data.notes;
      this.paid3xr = data.paid3xr;
      this.paidStudio = data.paidStudio;
      this.price = data.price;
      this.prority = new JobPriorityType(data.prority);
      this.project = new Project(data.project);
      this.product = new Product(data.product);
      this.status = new JobStatusType(data.status);
      this.studio = new Studio(data.studio);
      this.quality = new JobQualityType(data.quality);
      this.uid = data.uid;
      this.updatedAt = data.updatedAt;
      this.statusData = getStatusData(this);
    }
  }
}
