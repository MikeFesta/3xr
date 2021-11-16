// SPDX-License-Identifier: Apache-2.0
export enum AssetComplexityTypeEnum {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}
export enum AssetIssueCategoryTypeEnum {
  OTHER = 1,
  DIMENSIONS = 2,
  ORIENTATION = 3,
  GEOMETRY = 4,
  TEXTURES = 5,
}
export enum AssetIssueTypeEnum {
  OTHER = 1,
  INCORRECT_DIMENSIONS = 2,
  SCALE_TOO_LARGE = 3,
  SCALE_TOO_SMALL = 4,
  NOT_CENTERED = 5,
  UPSIDE_DOWN = 6,
  FACING_BACKWARDS = 7,
  FACING_SIDEWAYS = 8,
  GEO_NOT_ACCURATE = 9,
  INVERTED_NORMALS = 10,
  TOO_MANY_TRIANGLES = 11,
  NON_MANIFOLD_GEO = 12,
  UNNECESSARY_GEO = 13,
  MISSING_TEXTURES = 14,
  INACCURATE_COLORS = 15,
  LOW_RES_TEXTURES = 16,
  OVERLAPPING_UVS = 17,
  UV_ISLAND_MARGIN_TOO_SMALL = 18,
  BAD_UV_LAYOUT = 19,
  BAD_NORMAL_MAP = 20,
  BAD_AO_MAP = 21,
  BAD_ROUGHNESS_MAP = 22,
  BAD_METALLIC_MAP = 23,
}
export enum AssetMetricTypeEnum {
  PAGE_LOAD = 1, // Page Load
  MODEL_LOAD = 2, // Model Load
  RETURN_FROM_AR = 3, // Return from AR
  LEAVE_PAGE = 4, // Leave Page
  PAGE_REQUEST = 5, // Page Request
  ERROR = 6, // Error
  WEB_XR_SESSION_STARTED = 7, // Web XR Session Started
  WEB_XR_OBJECT_PLACED = 8, // Web XR Object Placed
  AR_FAILED = 9, // AR Failed
  VIEW_IN_YOUR_SPACE_QR = 10, // View in your space QR
  ENTER_FULLSCREEN = 11, // Enter Fullscreen
  EXIT_FULLSCREEN = 12, // Exit Fullscreen
  PAGE_VISIBLE = 13, // Page Visible
  QUICK_LOOK_BUTTON_TAPPED = 14, // Quick Look Button Tapped
  VIEW_IN_YOUR_SPACE_AR = 15, // View in your space AR
  FOCUS = 16, // Focus
  FOCUS_LOST = 17, // Focus Lost
  OPTION_CHANGE = 18, // Option Change
}
export enum AssetSubmissionIssueCategoryTypeEnum {
  PRODUCT = 1,
  MODEL = 2,
  TEXTURES = 3,
  AR = 4,
}
export enum AssetSubmissionIssueTypeEnum {
  // Product
  WRONG_PRODUCT = 1,
  WRONG_OPTION = 2,
  WRONG_COLOR = 3,
  EXTRA_FEATURES = 4,
  MISSING_FEATURES = 5,
  INACCURATE_PROPORTIONS = 6,
  PRODUCT_OTHER = 7,
  // Model
  INCORRECT_DIMENSIONS = 8,
  TOO_MANY_TRIANGLES = 9,
  NOT_CENTERED = 10,
  WRONG_ORIENTATION = 11,
  INVERTED_NORMALS = 12,
  NON_MANIFOLD_GEO = 13,
  UNNECESSARY_GEO = 14,
  MODEL_OTHER = 15,
  // Textures
  MISSING_TEXTURES = 16,
  LOW_RES_TEXTURES = 17,
  UV_ISLAND_MARGIN_TOO_SMALL = 18,
  BAD_UV_LAYOUT = 19,
  BAD_DIFFUSE_MAP = 20,
  BAD_NORMAL_MAP = 21,
  BAD_AO_MAP = 22,
  BAD_METALLIC_MAP = 23,
  BAD_ROUGHNESS_MAP = 24,
  TEXTURE_OTHER = 25,
  // AR
  AR_SCALE = 26,
  AR_PLACEMENT = 27,
  AR_COLOR = 28,
  AR_ARTIFACT = 29,
  AR_OTHER = 30,
}
export enum AssetSubmissionStatusTypeEnum {
  INITIAL_SUBMISSION = 1,
  SUBMISSION_CANCELED = 2,
  PROCESSING_VALIDATION = 3,
  FAILURE_VALIDATION = 4,
  PROCESSING_RENDER = 5,
  FAILURE_RENDER = 6,
  PROCESSING_TEXTURES = 7, // Texture resizing (and maybe baking)
  FAILURE_TEXTURES = 8,
  PROCESSING_GLB = 9,
  FAILURE_GLB = 10,
  PROCESSING_USDZ = 11,
  FAILURE_USDZ = 12,
  READY_FOR_QA = 13,
  QA_IN_PROGRESS = 14,
  QA_COMPLETE_FAILED = 15,
  QA_COMPLETE_PASSED = 16,
  PROCESSING_COMPLETE = 17,
}
export enum AssignmentModelingTypeEnum {
  FROM_SCRATCH = 1,
  FROM_CAD = 2,
  PHOTOGRAMMETRY = 3,
  SIX_SIDED_CUBE = 4,
}
export enum BlendModeEnum {
  OPAQUE = 0,
  CLIP = 1,
  HASHED = 2,
  BLEND = 3,
}
export enum JobCommentTypeEnum {
  ARTIST_COMMENT = 1,
  CLIENT_COMMENT = 2,
}
export enum JobDeadlineTypeEnum {
  NO_RISK = 1,
  RISK = 2,
  DUE_TODAY = 3,
  PAST_DUE = 4,
}
export enum JobQualityTypeEnum {
  STANDARD = 1,
  HIGHEST = 2,
}
export enum JobPriorityTypeEnum {
  STANDARD = 1,
  RUSH = 2,
}
export enum JobStatusTypeEnum {
  UNASSIGNED = 1, // On Job Initialization
  ASSIGNED = 2, // TODO: Make sure this is explicitly set
  IN_PROGRESS = 3, // record_zip_download, check_for_update
  SELF_QA = 4, // set_submission_status (when processing step 17 is triggered)
  TECHNICAL_QA = 5, // submit_for_qa
  REVISION_NEEDED = 6, // needs_technical_revision
  IN_REWORK = 7, // check_for_update
  CLIENT_QA = 8, // approve_technical comment, but not active
  COMPLETE = 9, //14,   // in approve_technical for now
  CANCELLED = 10, //15, // TODO: No way to get here (cancel button needed)
  PENDING_REVIEW = 16,
}
export enum NotificationStatus {
  UNSUBMITTED = 1,
  PENDING = 2,
  ACCEPTED = 3,
  IN_PROGRESS = 4,
  SUBMITTED_25 = 5,
  SUBMITTED_50 = 6,
  SUBMITTED_75 = 7,
  SUBMITTED_100 = 8,
  COMPLETED = 9,
  CANCELLED = 10,
}
export enum NotificationTypeEnum {
  JOB_UPDATED_TO_CLIENT_QA = 1,
  PROJECT_CREATED = 2,
  JOB_COMMENT_ADDED_ARTIST = 3,
  JOB_COMMENT_ADDED_CLIENT = 4,
  PURCHASE_ORDER = 5,
}
export enum ProjectProgress {
  COMPLETION_PROCESS_BEGAN = 1,
  SUBMITTED_25 = 2,
  SUBMITTED_50 = 3,
  SUBMITTED_75 = 4,
  SUBMITTED_100 = 5,
  PURCHASE_ORDER_COMPLETE = 6,
}
export enum NotificationReadStatusTypeEnum {
  PENDING = 1,
  DONE = 2,
  DELETED = 3,
}
export enum PermissionsLevelEnum {
  PUBLIC = 1,
  ANY_USER = 2,
  SPECIFIC_USER = 3,
  SPECIFIC_GROUP = 4,
  ADMIN_ONLY = 5,
}
export enum ProjectStatusTypesEnum {
  UNSUBMITTED = 1,
  IN_PROGRESS = 2,
  COMPLETE = 3,
  CANCELLED = 4,
  PENDING = 5,
  SUBMITTED_25_PERCENT = 6,
  SUBMITTED_50_PERCENT = 7,
  SUBMITTED_75_PERCENT = 8,
  SUBMITTED_100_PERCENT = 9,
}
export enum QaViewerEnum {
  GOOGLE_MODEL_VIEWER = 1,
  UNITY = 2,
  BABYLON = 3,
}
export enum RabbitMessageActionTypeEnum {
  TEST = 1,
  ZIP = 2,
  UNZIP = 3,
  CREATE_USDZ = 4,
  ARCHIVE = 5,
  UNARCHIVE = 6,
  POST_PROCESS = 7,
  PUBLISH = 8,
  MOVE_TO_X = 9,
  // New Commands - Nov. 2019 Refactor
  RENDER_THUMBNAIL = 10,
  INIT_PRODUCT = 11,
  VALIDATE_PRODUCT = 12,
  ZIP_PRODUCT = 13,
  UNZIP_PRODUCT = 14,
  BAKE_ASSET_MATERIAL = 15,
  ARCHIVE_PRODUCT = 16,
  UNARCHIVE_PRODUCT = 17,
  EXPORT_GLB = 18,
  EXPORT_USDZ = 19,
  INIT_MATERIAL = 20,
  RENDER_MATERIAL = 21,
  LINK_PRODUCT_MATERIALS = 22,
  USING_QUEUE_NAME = 99,
}
export enum RabbitMessageStatusTypeEnum {
  NEW = 1,
  SENT = 2,
  FAILED = 3,
  COMPLETE = 4,
}
export enum RoleEnum {
  ARTIST = 1,
  CLIENT = 2,
  ADMIN = 3,
  QA = 4,
  STUDIO_ADMIN = 5,
}
export enum SourceDataType {
  REFERENCE_PHOTOS = 1,
  CAD = 2,
  PHOTOS_360 = 3,
}
export enum TextureTypeEnum {
  AO = 1,
  CLEARCOAT = 2,
  CLEARCOAT_ROUGHNESS = 3,
  DIFFUSE = 4,
  EMISSIVE = 5,
  METALLIC = 6,
  NORMAL = 7,
  ROUGHNESS = 8,
}
export enum UnitTypeEnum {
  METERS = 1,
  INCHES = 2,
  CENTIMETERS = 3,
}
export enum AssignmentPriorityTypeEnum {
  HIGH = 1,
  STANDARD = 2,
  LOW = 3,
}
export enum DeviceTypeEnum {
  IOS = 1,
  ANDROID = 2,
  DESKTOP = 3,
}
export enum FileTypeEnum {
  UNKNOWN = 0,
  REFERENCE_IMAGE = 1,
  RENDER_JPG = 2,
  RENDER_PNG = 3,
  MODEL_USDZ = 4,
  MODEL_GLB = 5,
  QR = 6,
  SPIN_360 = 7,
  SPIN_GIF = 8,
  SPIN_VIDEO = 9,
  SPIN_360_ZIP = 10,
  RENDER_ORTHOGRAPHIC_ZIP = 11,
  QR_ZIP = 12,
  CRATE_AND_BARREL_ZIP = 13,
}
export enum UserAgreementTypeEnum {
  PRIVACY_POLICY = 1,
  TERMS_OF_SERVICE = 2,
}
// EmailType decides which Vue template will be generated
export enum EmailType {
  CLIENT_QA = 'CLIENT_QA',
  JOB_IN_REVISION = 'JOB_IN_REVISION',
  COMMENT = 'COMMENT',
  PO_IN_PROGRESS = 'PO_IN_PROGRESS',
}
export enum ProductHoldingTypeEnum {
  BIG_COMMERCE = 1,
}
