// SPDX-License-Identifier: Apache-2.0
export interface ProjectHoldingCreationAttributes {
  clientId: number;
  defaultUnitType: number;
  name: string;
}

export interface ProjectHoldingAttributes extends ProjectHoldingCreationAttributes {
  id: number;
  deleted: boolean;
}
