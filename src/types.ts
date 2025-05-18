export interface OutputRecord extends TagMaps {
  id: number;
  appCode: any;
  deviceId: string;
  contactable: boolean;
}

export interface TagMaps {
  subscription_status: string;
  has_downloaded_free_product_status: string;
  has_downloaded_iap_product_status: string;
  unknown_tags: string[];
};

export type HeaderKeys = { [K in keyof OutputRecord]: K };
