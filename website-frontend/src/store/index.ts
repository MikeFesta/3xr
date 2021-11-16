// SPDX-License-Identifier: Apache-2.0
import Vue from 'vue';
import Vuex from 'vuex';
import { createDirectStore } from 'direct-vuex';
import VuexPersistence from 'vuex-persist';
import artists, { ArtistsState } from '@/store/states/ArtistsState';
import asset, { AssetState } from '@/store/states/AssetState';
import assets, { AssetsState } from '@/store/states/AssetsState';
import assetSubmission, { AssetSubmissionState } from '@/store/states/AssetSubmissionState';
import assetSubmissionIssue, { AssetSubmissionIssueState } from '@/store/states/AssetSubmissionIssueState';
import assetSubmissionIssueHotspots, {
  AssetSubmissionIssueHotspotsState,
} from '@/store/states/AssetSubmissionIssueHotspotsState';
import client, { ClientState } from '@/store/states/ClientState';
import clientBrands, { ClientBrandState } from '@/store/states/ClientBrandsState';
import clients, { ClientsState } from '@/store/states/ClientsState';
import clientClasses, { ClientClassState } from '@/store/states/ClientClassesState';
import comments, { CommentsState } from '@/store/states/Comments/state';
import filterJobs, { FilterJobsState } from '@/store/states/FilterJobsState';
import history, { HistoryState } from '@/store/states/HistoryState';
import job, { JobState } from '@/store/states/JobState';
import jobs, { JobsState } from '@/store/states/JobsState';
import material, { MaterialState } from '@/store/states/MaterialState';
import materials, { MaterialsState } from '@/store/states/MaterialsState';
import notifications from '@/store/states/Notifications/state';
import { NotificationsState } from '@/store/states/Notifications/interfaces';
import part, { PartState } from '@/store/states/PartState';
import parts, { PartsState } from '@/store/states/PartsState';
import pickList, { PickListState } from '@/store/states/PickListState';
import project, { ProjectState } from '@/store/states/ProjectState';
import projects, { ProjectsState } from '@/store/states/ProjectsState';
import projectHoldings, { ProjectHoldingState } from '@/store/states/ProjectHoldings';
import product, { ProductState } from '@/store/states/ProductState';
import products, { ProductsState } from '@/store/states/ProductsState';
import studio, { StudioState } from '@/store/states/StudioState';
import studios, { StudiosState } from '@/store/states/StudiosState';
import theme, { ThemeState } from '@/store/states/ThemeState';
import user, { UserState } from '@/store/states/UserState';
import users, { UsersState } from '@/store/states/UsersState';
import usersAgreement, { UserAgreementState } from '@/store/states/UserAgreementState';
import usersAgreements, { UserAgreementsState } from '@/store/states/UserAgreementsState';
import usersAgreementResponses, { UserAgreementResponsesState } from '@/store/states/UserAgreementResponsesState';
import xr, { XrState } from '@/store/states/XrState';

const vuexLocal = new VuexPersistence({
  reducer: (state: any) => state.history.history,
  storage: window.localStorage,
});

Vue.use(Vuex);

interface RootState {
  artists: ArtistsState;
  asset: AssetState;
  assets: AssetsState;
  assetSubmission: AssetSubmissionState;
  assetSubmissionIssue: AssetSubmissionIssueState;
  assetSubmissionIssueHotspots: AssetSubmissionIssueHotspotsState;
  client: ClientState;
  clientBrands: ClientBrandState;
  clientClasses: ClientClassState;
  clients: ClientsState;
  comments: CommentsState;
  history: HistoryState;
  job: JobState;
  jobs: JobsState;
  material: MaterialState;
  materials: MaterialsState;
  notifications: NotificationsState;
  otherUser: UserState;
  part: PartState;
  parts: PartsState;
  pickList: PickListState;
  project: ProjectState;
  projects: ProjectsState;
  product: ProductState;
  products: ProductsState;
  projectHoldings: ProjectHoldingState;
  studio: StudioState;
  studios: StudiosState;
  theme: ThemeState;
  user: UserState;
  users: UsersState;
  usersAgreement: UserAgreementState;
  usersAgreements: UserAgreementsState;
  usersAgreementResponses: UserAgreementResponsesState;
  filterJobs: FilterJobsState;
  xr: XrState;
}

const { store, rootActionContext, moduleActionContext } = createDirectStore({
  modules: {
    artists,
    asset,
    assets,
    assetSubmission,
    assetSubmissionIssue,
    assetSubmissionIssueHotspots,
    client,
    clientBrands,
    clientClasses,
    clients,
    comments,
    history,
    job,
    jobs,
    material,
    materials,
    notifications,
    otherUser: user,
    part,
    parts,
    pickList,
    project,
    projects,
    product,
    products,
    projectHoldings,
    studio,
    studios,
    theme,
    user,
    users,
    usersAgreement,
    usersAgreements,
    usersAgreementResponses,
    filterJobs,
    xr,
  },
  plugins: [vuexLocal.plugin],
});

const appSettings = {
  serverUrl: 'https://' + (process.env.VUE_APP_BACKEND_URL || 'www.3xr.com') + '/a',
};

export default store;

export { rootActionContext, moduleActionContext, RootState };

export type AppStore = typeof store;

declare module 'vuex' {
  interface Store<S> {
    direct: AppStore;
  }
}

export { appSettings };
