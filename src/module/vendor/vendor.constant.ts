export enum VendorApiTags {
  API_TAG = 'Vendors',
}

export enum VendorApi {
  CONTROLLER = 'purchase/vendor',
}

export enum VendorApiPath {
  CREATE_VENDOR = 'create',
  UPDATE_VENDOR = 'edit',
  VENDOR_ITEM_TYPE_CREATE_OR_EDIT = `vendorItemType/createOrEdit`,
}

export enum VendorEnum {
  TRUE = 1,
  FALSE = 2,
}

export enum IsAdvanceEnum {
  FALSE = 0,
  TRUE = 1,
}

export enum PaymentCategoryEnum {
  ADVANCE_AND_DISPATH = 1,
  ADVANCE_AND_CREDIT = 2,
  ADVANCE = 3,
  CREDIT = 4,
}
