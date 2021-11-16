// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export interface ClientClassInterface extends IdNameInterface { }

export default class ClientClass extends IdName implements ClientClassInterface { }
