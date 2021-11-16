// SPDX-License-Identifier: Apache-2.0
export interface ProductFavoriteCreationAttributes {
  productId: number;
  userId: number;
}

export interface ProductFavoriteAttributes extends ProductFavoriteCreationAttributes {
  id: number;
}
