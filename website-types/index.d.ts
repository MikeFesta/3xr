// SPDX-License-Identifier: Apache-2.0
import { Model } from 'sequelize';
import { CombinedVueInstance, Vue } from 'vue/types/vue';
import {
  EmailType,
  NotificationStatus,
  NotificationTypeEnum,
  ProductHoldingTypeEnum,
  ProjectProgress,
  UnitTypeEnum,
} from './enums';
// All of these models extend this interface
// The other option is to use ...Instance Model<...SubmissionAttributes, ...CreationAttributes>, but it feels bloated for the frontend
export interface SequelizeModelAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
export type Component = CombinedVueInstance<Vue, any, any, any, Record<never, any>>;
export interface AssetAbAlternativeCreationAttributes {
  assetId: number;
  probabilityWeight: number;
}
export interface AssetAbAlternativeAttributes extends AssetAbAlternativeCreationAttributes {
  bannerButtonText?: string;
  cameraOrbit?: string;
  cameraTarget?: string;
  exposure?: number;
  hdr?: string;
  id: number;
  productName?: string;
  productPrice?: string;
  productSubtitle?: string;
  productUrl?: string;
  shadowIntensity?: number;
  showBanner?: boolean;
  showOptions?: boolean;
}
export interface AssetComplexityTypeCreationAttributes {
  name: string;
}
export interface AssetComplexityTypeAttributes extends AssetComplexityTypeCreationAttributes {
  id: number;
}
export interface AssetFileCreationAttributes {
  assetId: number;
  collection?: number;
  filename: string;
  hash: string;
  order?: number;
  size: number;
  typeId: number;
}
export interface AssetFileAttributes extends AssetFileCreationAttributes {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  delete: boolean;
}
export interface AssetCreationAttributes {
  cameraOrbit?: string;
  cameraTarget?: string;
  complexityId: number;
  hdr?: string;
  name: string;
  probabilityWeight?: number;
  productName?: string;
  productUrl?: string;
  uid: string;
}
export interface AssetAttributes extends AssetCreationAttributes, SequelizeModelAttributes {
  abAlteratives?: AssetAbAlternativeAttributes[];
  allowDownload: boolean;
  bannerButtonText?: string;
  delete: boolean;
  exposure?: number;
  passwordHash?: string;
  published?: boolean;
  publishDate?: Date;
  product?: ProductInstance;
  productPrice?: string;
  productSubtitle?: string;
  shadowIntensity?: number;
  showBanner?: boolean;
  rating: number;
  showOptions: boolean;
  textures?: AssetTextureInstance[];
}
export interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {
  initAndZip(): Promise<void>;
}
export interface AssetTextureInstance
  extends Model<AssetTextureAttributes, AssetTextureCreationAttributes>,
    AssetTextureAttributes {}
export interface AssetIssueCategoryTypeCreationAttributes {
  name: string;
  sort_weight: number;
}
export interface AssetIssueCategoryTypeAttributes extends AssetIssueCategoryTypeCreationAttributes {
  id: number;
}
export interface AssetIssueCreateI {
  asset_id: number;
  author_user_id: number;
  issue_type_id: number;
  additional_details: string;
  screenshot: string;
  resolved: boolean;
}
export interface AssetIssueI extends AssetIssueCreateI {
  id: number;
}
export interface AssetIssueTypeCreationAttributes {
  name: string;
  category_id: number;
  sort_weight: number;
}
export interface AssetIssueTypeAttributes extends AssetIssueTypeCreationAttributes {
  id: number;
}
export interface AssetMetricCreationAttributes {
  abId?: number | null;
  assetUid: string;
  cameraEngagement: number;
  customerUid: string;
  deviceTypeId: number | null;
  ipAddress: string;
  metricTypeId: number;
  notes?: string;
  sessionUid: string | null;
  sessionTimeMs: number;
  source: string | null;
  url: string;
  userAgent?: string | null;
  viewerSessionUid: string;
}
export interface AssetMetricAttributes extends AssetMetricCreationAttributes {
  id: number;
}
export interface AssetMetricTypeCreationAttributes {
  name: string;
}
export interface AssetMetricTypeAttributes extends AssetMetricTypeCreationAttributes {
  id: number;
}
export interface AssetRenderCreationAttributes {
  assetId: number;
  fileName: string;
}
export interface AssetRenderAttributes extends AssetRenderCreationAttributes {
  id: number;
}
export interface AssetSpinSetCreationAttributes {
  angle: number;
  assetId: number;
  imageCount: number;
  resolution: number;
}
export interface AssetSpinSetAttributes extends AssetSpinSetCreationAttributes {
  id: number;
}
export interface AssetSubmissionCreationAttributes {
  assetId: number;
  date?: Date;
  depth?: number;
  folder: string;
  hasReachedClient?: boolean;
  height?: number;
  lightCount?: number;
  statusId?: number;
  submissionNumber?: number;
  triangleCount?: number;
  unitTypeId?: number;
  userId: number;
  width?: number;
}
export interface AssetSubmissionAttributes extends AssetSubmissionCreationAttributes, SequelizeModelAttributes {
  asset?: AssetAttributes; // TODO: is this too limiting on the backend? would Model<...> be better?
}
export interface AssetSubmissionIssueCategoryTypeCreationAttributes {
  name: string;
  label: string;
  sortWeight: number;
}
export interface AssetSubmissionIssueCategoryTypeAttributes extends AssetSubmissionIssueCategoryTypeCreationAttributes {
  id: number;
}
export interface AssetSubmissionIssueHotspotCreationAttributes {
  assetSubmissionIssueId: number;
  normal: string;
  position: string;
}
export interface AssetSubmissionIssueHotspotAttributes extends AssetSubmissionIssueHotspotCreationAttributes {
  id: number;
}
export interface AssetSubmissionIssueCreationAttributes {
  assetSubmissionId: number;
  authorUserId: number;
  authorRoleId: number;
  issueTypeId: number;

  description: string;
}
export interface AssetSubmissionIssueAttributes extends AssetSubmissionIssueCreationAttributes {
  id: number;
  deleted: boolean;
  imageCategory: number;
  imageId: number;
  imageX: number;
  imageY: number;
  resolved: boolean;
  resolutionTime: string;
  response: string;
}
export interface AssetSubmissionIssueImageCreattionAttributes {
  assetSubmissionIssueId: number;
  filename: string;
}
export interface AssetSubmissionIssueImageAttributes extends AssetSubmissionIssueImageCreattionAttributes {
  id: number;
}
export interface AssetSubmissionIssueTypeCreationAttributes {
  name: string;
  categoryId: number;
  sortWeight: number;
}
export interface AssetSubmissionIssueTypeAttributes extends AssetSubmissionIssueTypeCreationAttributes {
  id: number;
}
export interface AssetSubmissionRenderCreationAttributes {
  assetSubmissionId: number;
  filename: string;
}
export interface AssetSubmissionRenderAttributes extends AssetSubmissionRenderCreationAttributes {
  id: number;
}
export interface AssetSubmissionStatusTypeCreationAttributes {
  name: string;
  resubmissionAllowed: boolean;
}
export interface AssetSubmissionStatusTypeAttributes extends AssetSubmissionStatusTypeCreationAttributes {
  id: number;
}
export interface AssetSubmissionTextureCreationAttributes {
  assetSubmissionId: number;
  filename: string;
}
export interface AssetSubmissionTextureAttributes extends AssetSubmissionTextureCreationAttributes {
  id: number;
}
export interface AssetTagCreationAttributes {
  asset_id: string;
  tag_id: number;
  sort_weight: number;
}
export interface AssetTagAttributes extends AssetTagCreationAttributes {
  id: number;
}
export interface AssetTextureCreationAttributes {
  assetId: number;
  color: string;
  filename: string;
  fileExtensionTypeId: number;
  textureTypeId: number;
}
export interface FileExtensionTypeInstance
  extends Model<FileExtensionTypeAttributes, FileExtensionTypeCreationAttributes>,
    FileExtensionTypeAttributes {}

export interface AssetTextureAttributes extends AssetTextureCreationAttributes {
  id: number;
  extension?: FileExtensionTypeInstance;
}
export interface AssetUploadLogCreationAttributes {
  id: number;
  asset_id: number;
  modeling_hours: number;
  texturing_hours: number;
}
export interface AssetUploadLogAttributes extends AssetUploadLogCreationAttributes {
  id: number;
}
export interface AssignmentModelingTypeCreationAttributes {
  name: string;
}
export interface AssignmentModelingTypeAttributes extends AssignmentModelingTypeCreationAttributes {
  name: string;
}
export interface AssignmentPriorityTypeCreationAttributes {
  name: string;
}
export interface AssignmentPriorityTypeAttributes extends AssignmentPriorityTypeCreationAttributes {
  id: number;
}
export interface BlenderAddonCreationAttributes {
  version: string;
  blenderVersion: string;
}
export interface BlenderAddonAttributes extends BlenderAddonCreationAttributes {
  id: number;
}
export interface ClientBrandCreationAttributes {
  clientId: number;
  name: string;
}
export interface ClientBrandAttributes extends ClientBrandCreationAttributes {
  id: number;
  deleted: boolean;
}
export interface ClientClassCreationAttributes {
  clientId: number;
  name: string;
}
export interface ClientClassAttributes extends ClientClassCreationAttributes {
  id: number;
  deleted: boolean;
}
export interface ClientCreationAttributes {
  uid: string;
  name: string;
}
export interface ClientAttributes extends ClientCreationAttributes, SequelizeModelAttributes {}
export interface ClientStudioAttributes {
  clientId: number;
  studioId: number;
}
export interface DeviceTypeCreationAttributes {
  name: string;
}
export interface DeviceTypeAttributes extends DeviceTypeCreationAttributes {
  id: number;
}
export interface UserPublicInfo {
  username: string;
}
interface User {
  email: string;
  firstName: string;
  lastName: string;
  emailNotifications: boolean;
}
interface Product {
  name: string;
  href: string;
}
interface Project {
  name: string;
  href: string;
}
export interface BaseTemplate {
  bcc?: string[];
}
export interface CommentTemplate extends BaseTemplate {
  type: EmailType.COMMENT;
  user: User;
  product: Product;
  commentatorName: string;
}
export interface ClientQaTemplate extends BaseTemplate {
  type: EmailType.CLIENT_QA;
  user: User;
  product: Product;
}
export interface RevisionTemplate extends BaseTemplate {
  type: EmailType.JOB_IN_REVISION;
  user: User;
  product: Product;
}
export interface PurchaseOrderTemplate extends BaseTemplate {
  type: EmailType.PO_IN_PROGRESS;
  user: User;
  project: Project;
}
// describes what kind of email we want to send to a specific user
export type TemplateRequest = CommentTemplate | ClientQaTemplate | RevisionTemplate | PurchaseOrderTemplate;
export interface MailInfo {
  html: string;
  subject: string;
}
export interface EmailRequest extends MailInfo {
  email: string;
  bcc?: string[];
}
export interface NotificationContext {
  header: string;
  content: string;
  href: string;
  buttonText: string;
}
export interface EmailLogCreationAttributes {
  emailTo: string;
  subject: string;
  html: string;
}
export interface EmailLogAttributes extends EmailLogCreationAttributes {
  id: number;
}
export interface ErrorCreationAttributes {
  hash: string;
  message: string;
}
export interface ErrorAttributes extends ErrorCreationAttributes {
  id: number;
}
export interface FaqCreateI {
  title: string;
  question: string;
  answer?: string;
  askedByUserId: number;
  answeredByUserId?: number;
  answered?: boolean;
  public?: boolean;
  sortWeight?: number;
}
export interface FaqI extends FaqCreateI {
  id: number;
}
export interface FileExtensionTypeCreationAttributes {
  name: string;
}
export interface FileExtensionTypeAttributes extends FileExtensionTypeCreationAttributes {
  id: number;
}
export interface FileTypeCreationAttributes {
  name: string;
}
export interface FileTypeAttributes extends FileTypeCreationAttributes {
  id: number;
}
export interface HelpChapterCreationAttributes {
  title: string;
  icon: number;
  sortWeight: number;
}
export interface HelpChapterAttributes extends HelpChapterCreationAttributes {
  id: number;
}
export interface HelpChapterSectionCreationAttributes {
  title: string;
  content: string;
  latestUserId: number;
  helpChapterId: number;
  sortWeight: number;
}
export interface HelpChapterSectionAttributes extends HelpChapterSectionCreationAttributes {
  id: number;
}
export interface IconCreationAttributes {
  name: string;
  noun_project_id: string;
}
export interface IconAttributes extends IconCreationAttributes {
  id: number;
}
export interface IPLogCreationAttributes {
  ip: string;
  user_id?: number;
}
export interface IPLogAttributes extends IPLogCreationAttributes {
  id: number;
}
export interface JobCommentCreationAttributes {
  content: string;
  createdAt?: Date;
  jobUid: string;
  parentCommentId?: number;
  jobCommentType: number;
  userId: number;
  updatedAt?: Date;
}
export interface JobCommentAttributes extends JobCommentCreationAttributes {
  id: number;
  deleted: boolean;
}
export interface JobCommentTypeCreationAttributes {
  name: string;
}
export interface JobCommentTypeAttributes extends JobCommentTypeCreationAttributes {
  id: number;
}
export interface JobDeadlineSnapshotCreationAttributes {
  date: string;
  jobCount: number;
  typeId: number;
}
export interface JobDeadlineSnapshotAttributes extends JobDeadlineSnapshotCreationAttributes {
  id: number;
}
export interface JobDeadlineTypeCreationAttributes {
  name: string;
}
export interface JobDeadlineTypeAttributes extends JobDeadlineTypeCreationAttributes {
  id: number;
}
export interface JobCreationAttributes {
  additionalDimensions?: string;
  brandId: number;
  classId: number;
  clientId: number;
  dateCompleted?: Date;
  dateDue: string;
  deleted?: boolean;
  materialInformation: string;
  modelingInstructions: string;
  notes: string;
  price?: number;
  priorityId: number;
  productId: number;
  projectId: number;
  statusId?: number;
  statusCount?: number;
  studioId: number;
  qualityId: number;
  uid: string;
}
export interface JobAttributes extends JobCreationAttributes {
  billingCharge: number;
  billingMonth: number;
  id: number;
  paid3xr: boolean;
  paidStudio: boolean;
  product?: ProductInstance;
  statusId: number;
}
export interface JobPriorityTypeCreationAttributes {
  name: string;
}
export interface JobPriorityTypeAttributes extends JobPriorityTypeCreationAttributes {
  id: number;
}
export interface JobQualityTypeCreationAttributes {
  name: string;
}
export interface JobQualityTypeAttributes extends JobQualityTypeCreationAttributes {
  id: number;
}
export interface JobStatusLogCreationAttributes {
  jobId: number;
  statusId: number;
}
export interface JobStatusLogAttributes extends JobStatusLogCreationAttributes {
  id: number;
}
export interface JobStatusSnapshotCreationAttributes {
  date: string;
  jobCount: number;
  jobStatusId: number;
}
export interface JobStatusSnapshotAttributes extends JobStatusSnapshotCreationAttributes {
  id: number;
}
export interface JobStatusTypeCreationAttributes {
  name: string;
}
export interface JobStatusTypeAttributes extends JobStatusTypeCreationAttributes {
  id: number;
}
export interface LoginTokenCreationAttributes {
  userId: number;
  token: string;
  ip: string;
  userAgent: string;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface LoginTokenAttributes extends LoginTokenCreationAttributes {
  id: number;
}
export interface MailingListCreationAttributes {
  name: string;
  email: string;
  interest: number;
  ip: string;
  phone: string;
  //@todo fix on backed and client
  comanpy: string;
  message: string;
}
export interface MailingListAttributes extends MailingListCreationAttributes {
  id: number;
}
export interface MaterialCreationAttributes {
  blendMode: number; // 0:OPAQUE, 1:CLIP, 2:HASHED, 3:BLEND
  blendName: string;
  diffuseRedValue: number;
  diffuseGreenValue: number;
  diffuseBlueValue: number;
  mappingScaleValue: number;
  metallicValue: number;
  normalStrengthValue: number;
  name: string;
  roughnessValue: number;
  uid: string;
}
export interface MaterialAttributes extends MaterialCreationAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface INotificationWithoutRecipient {
  clientId?: number;
  jobCommentId?: number;
  jobId?: number;
  notificationTypeId: NotificationTypeEnum;
  projectId?: number;
  productId?: number;
}
export interface PartSlotCreationAttributes {
  partId: number;
  slotName: string;
}
export interface PartSlotAttributes extends PartSlotCreationAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface PartCreationAttributes {
  blendName: string;
  createdFromSubmissionId: number;
  name: string;
  uid: string;
}
export interface PartAttributes extends PartCreationAttributes, SequelizeModelAttributes {}
export interface ProductFavoriteCreationAttributes {
  productId: number;
  userId: number;
}
export interface ProductFavoriteAttributes extends ProductFavoriteCreationAttributes {
  id: number;
}
export interface INotification {
  id?: number;
  clientId?: number;
  jobCommentId?: number;
  jobId?: number;
  notificationTypeId: NotificationTypeEnum;
  projectId?: number;
  productId?: number;
  readStatusId?: number;
  userId: number;
}
export interface NotificationContent {
  id: number;
  projectProgress?: ProjectProgress;
}
export interface NotificationEvent {
  status: NotificationStatus;
  contents: NotificationContent[];
  clientId: number;
  projectId: number;
  type: number;
}
export interface NotificationCreationAttributes {
  userId: number;
  notificationTypeId: number;
  clientId?: number;
  jobCommentId?: number;
  jobId?: number;
  projectId?: number;
  productId?: number;
  refUserId?: number;
  projectProgress?: number;
}
export interface NotificationAttributes extends NotificationCreationAttributes {
  id: number;
  readStatusId: number;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface NotificationReadStatusTypeCreationAttributes {
  name: string;
}
export interface NotificationReadStatusTypeAttributes extends NotificationReadStatusTypeCreationAttributes {
  id: number;
}
export interface NotificationTypeCreationAttributes {
  name: string;
}
export interface NotificationTypeAttributes extends NotificationTypeCreationAttributes {
  id: number;
}
export interface PaymentCreationAttributes {
  uuid: string;
  admin_user_id: number;
  artistUserId: number;
  paypal_email: string;
  paypal_transaction_id: string;
  transaction_amount: number;
  transaction_date: Date;
}
export interface PaymentAttributes extends PaymentCreationAttributes {
  id: number;
}
export interface PermissionsLevelCreationAttributes {
  name: string;
}
export interface PermissionsLevelAttributes extends PermissionsLevelCreationAttributes {
  id: number;
}
export interface ProductAdditionalFileCreationAttributes {
  filename: string;
  productId: number;
  sortWeight: number;
}
export interface ProductAdditionalFileAttributes extends ProductAdditionalFileCreationAttributes {
  id: number;
}
export interface ProductCombinationCreationAttributes {
  productId: number;
  assetId: number;
}
//export interface AssetInstance extends Model<AssetAttributes, AssetCreationAttributes>, AssetAttributes {}
export interface ProductCombinationAttributes extends ProductCombinationCreationAttributes {
  id: number;
  asset?: AssetAttributes;
}
export interface UnitTypeCreationAttributes {
  name: string;
}
export interface UnitTypeAttributes extends UnitTypeCreationAttributes, SequelizeModelAttributes {}
export interface ProductCreationAttributes {
  assetId?: number;
  bcProductId?: number;
  isReviewedImport?: boolean;
  artistUserId?: number;
  asin?: string;
  blendName?: string;
  deleted?: boolean;
  depth?: number;
  height?: number;
  modelingTypeId?: number;
  name: string;
  partNumber: string;
  uid: string;
  units?: UnitTypeAttributes;
  unitTypeId?: number;
  url: string;
  width?: number;
}
export interface ProductAttributes extends ProductCreationAttributes, SequelizeModelAttributes {
  artist?: UserAttributes;
  asset?: AssetAttributes;
  combinations?: ProductCombinationInstance[];
}
export interface ProductCombinationInstance
  extends Model<ProductCombinationAttributes, ProductCombinationCreationAttributes>,
    ProductCombinationAttributes {}
export interface ProductMaterialCreationAttributes {
  productId: number;
  materialId: number;
  slotName: string;
}
export interface ProductMaterialAttributes extends ProductMaterialCreationAttributes {
  id: number;
}
export interface ProductPartCreationAttributes {
  productId: number;
  partId: number;
}
export interface ProductPartAttributes extends ProductPartCreationAttributes {
  createdAt: Date;
  updatedAt: Date;
}
export interface ProductReferenceImageCreationAttributes {
  filename: string | null;
  primary: boolean;
  productId: number;
  sortWeight: number;
  fallbackImageUrl?: string;
}
export interface ProductReferenceImageAttributes extends ProductReferenceImageCreationAttributes {
  id: number;
}
export interface ProductVerticalCreationAttributes {
  name: string;
  uuid: string;
}
export interface ProductVerticalAttributes extends ProductVerticalCreationAttributes {
  id: number;
}
export interface ProjectCreationAttributes {
  clientId: number;
  dateDue: string;
  defaultArtistId: number;
  defaultBrand: number;
  defaultClass: number;
  defaultPrice: number;
  defaultPriority: number;
  defaultQuality: number;
  defaultUnitType: number;
  isCreatedFromHolding?: boolean;
  name: string;
  notificationStatusId?: number;
  statusId: number;
  studioId: number;
  uid: string;
}
export interface ProjectAttributes extends ProjectCreationAttributes {
  id: number;
  dateCompleted: Date;
  deleted: boolean;
  isUserAuthorized(userId: number): Promise<boolean>;
}
export interface ProjectResourcesUploadCreationAttributes {
  filename: string;
  projectId: number;
}
export interface ProjectResourcesUploadAttributes extends ProjectResourcesUploadCreationAttributes {
  id: number;
}
export interface ProjectStatusTypeCreationAttributes {
  name: string;
}
export interface ProjectStatusTypeAttributes extends ProjectStatusTypeCreationAttributes {
  id: number;
}
export interface RabbitMessageActionStatusTextCreationAttributes {
  action: number;
  status_id: number;
  text: string;
}
export interface RabbitMessageActionStatusTextAttributes extends RabbitMessageActionStatusTextCreationAttributes {
  id: number;
}
export interface RabbitMessageActionTypeCreationAttributes {
  name: string;
}
export interface RabbitMessageActionTypeAttributes extends RabbitMessageActionTypeCreationAttributes {
  id: number;
}
export interface RabbitMessageCreationAttributes {
  action_id: number;
  queue: string;
  status_id: number;
  user_id: number;
  data: string;
  error_message?: string;
  delete?: boolean;
  //previousRabbitMessageId?: number; // Add this after migrating x.3xr.com
}
export interface RabbitMessageAttributes extends RabbitMessageCreationAttributes {
  id: number;
}
export interface RabbitMessageStatusTypeCreationAttributes {
  name: string;
}
export interface RabbitMessageStatusTypeAttributes extends RabbitMessageStatusTypeCreationAttributes {
  id: number;
}
export interface RoleCreationAttributes {
  name: string;
}
export interface RoleAttributes extends RoleCreationAttributes {
  id: number;
}
export interface StudioCreationAttributes {
  uid: string;
  name: string;
}
export interface StudioAttributes extends StudioCreationAttributes, SequelizeModelAttributes {}
export interface TagCreationAttributes {
  name: string;
  sort_weight: number;
  permissions_level_id: number;
}
export interface TagAttributes extends TagCreationAttributes {
  id: number;
}
export interface TextureTypeCreationAttributes {
  name: string;
}
export interface TextureTypeAttributes extends TextureTypeCreationAttributes {
  id: number;
}
export interface UserAgreementCreationAttributes {
  userAgreementTypeId: number;
  version: number;
}
export interface UserAgreementAttributes extends UserAgreementCreationAttributes {
  id: number;
}
export interface UserAgreementResponseCreationAttributes {
  createdAt?: Date;
  updatedAt?: Date;
  userAgreementId: number;
  userId: number;
  response: boolean;
}
export interface UserAgreementResponseAttributes extends UserAgreementResponseCreationAttributes {
  id: number;
}
export interface UserAgreementTypeCreationAttributes {
  name: string;
}
export interface UserAgreementTypeAttributes extends UserAgreementTypeCreationAttributes {
  id: number;
}
export interface UserClientAttributes {
  userId: number;
  clientId: number;
}
export interface UserCreationAttributes {
  admin?: boolean;
  apiToken?: string;
  artist?: boolean;
  email: string;
  emailNotifications?: boolean;
  firstName: string;
  hash: string;
  lastName: string;
  phone?: string;
  primaryRoleId?: number;
  qaViewer?: number;
  resetPasswordHash?: string;
  username: string;
}
export interface LoginTokenInstance
  extends Model<LoginTokenAttributes, LoginTokenCreationAttributes>,
    LoginTokenAttributes {}
export interface UserAttributes extends UserCreationAttributes, SequelizeModelAttributes {
  emailNotifications: boolean;
  // Computed relationships
  loginTokens?: LoginTokenInstance[];
}
export interface UserStudioAttributes {
  userId: number;
  studioId: number;
}
// legacy naming from studio.3xr.com user login details
export interface UserStudioDetailsI {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  admin: boolean;
  artist: boolean;
  primaryRoleId: number;
  token?: string;
}
export interface UserRoleAttributes {
  userId: number;
  roleId: number;
}
export interface WebCrawlerQueryCreationAttributes {
  search_term: string;
  user_id: number;
  count: number;
  complete: boolean;
  archive: boolean;
}
export interface WebCrawlerQueryAttributes extends WebCrawlerQueryCreationAttributes {
  id: number;
}
export interface ProductCreationAttributesWithoutComputedFields {
  assetId?: number;
  bcProductId?: number;
  artistUserId?: number;
  asin?: number;
  depth?: number;
  height?: number;
  width?: number;
  modelingTypeId?: number;
  name: string;
  partNumber: string;
  unitTypeId?: number;
  url: string;
  deleted?: boolean;
  units?: UnitTypeAttributes;
}
export interface ProductHoldingCreationAttributes {
  bcProductId?: number;
  clientId: number;
  projectHoldingId?: number;
  productHoldingType: ProductHoldingTypeEnum;
  depth: number;
  height: number;
  width: number;
  name: string;
  description: string;
  partNumber: string;
  sku?: string;
  unitTypeId: UnitTypeEnum;
  deleted: boolean;
}
export interface ProductHoldingAttributes extends ProductHoldingCreationAttributes {
  id: number;
  referenceImages?: ProductHoldingReferenceImageAttributes[];
}
export interface ProjectHoldingCreationAttributes {
  clientId: number;
  defaultUnitType: number;
  name: string;
}
export interface ProjectHoldingAttributes extends ProjectHoldingCreationAttributes {
  id: number;
  deleted: boolean;
}
export interface ProductHoldingReferenceImageCreationAttributes {
  filename: string;
  bcProductId?: number;
  bcProductReferenceImageId?: number;
  imageLargeUrl: string;
  imageSmallUrl: string;
  productHoldingId: number;
  primary: boolean;
  sortWeight: number;
}
export interface ProductHoldingReferenceImageAttributes extends ProductHoldingReferenceImageCreationAttributes {
  id: number;
  deleted: boolean;
}
export interface ProductHoldingTypeCreationAttributes {
  name: string;
}
export interface ProductHoldingTypeAttributes extends ProductHoldingTypeCreationAttributes {
  id: number;
}
export interface ProjectHoldingInstance
  extends Model<ProjectHoldingAttributes, ProjectHoldingCreationAttributes>,
    ProjectHoldingAttributes {}
