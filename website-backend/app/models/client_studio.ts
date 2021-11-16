// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ClientStudioAttributes } from '3xr_types';
import { sql } from '@root/sql';

interface ClientStudioInstance extends Model<ClientStudioAttributes, ClientStudioAttributes>, ClientStudioAttributes {}

type ClientStudioModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ClientStudioInstance;
  getClientStudioIds(userId: number): Promise<number[]>;
};

export const ClientStudio = sql.define('client_studio', {
  clientId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  studioId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as ClientStudioModelStatic;

export default ClientStudio;

ClientStudio.getClientStudioIds = async (clientId: number) => {
  const clientStudios = await ClientStudio.findAll({
    where: { clientId: clientId },
  });
  return clientStudios.map(clientStudio => clientStudio.studioId);
};
