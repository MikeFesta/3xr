// SPDX-License-Identifier: Apache-2.0
export interface Tab {
  title: String;
  icon: String;
  link: String;
}

export interface Tabs {
  admin: Tab[];
  client: Tab[];
  artist: Tab[];
  qa: Tab[];
  [key: string]: any;
}
