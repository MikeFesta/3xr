// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export interface ClientBrandInterface extends IdNameInterface { }

export interface INewBrandRequest {
  clientId: number;
  name: string;
}

export interface INewClassRequest {
  clientId: number;
  name: string;
}

export default class ClientBrand extends IdName implements ClientBrandInterface { }
