import { TagMaps } from "./types";

export function classifyTags(tags: string): TagMaps {
  const tagArray = tags?.split("|") ?? [];

  const validSubscriptionStatus = [
    "active_subscriber",
    "expired_subscriber",
    "never_subscribed",
    "subscription_unknown",
  ];

  const validFreeProductStatus = [
    "has_downloaded_free_product",
    "not_downloaded_free_product",
    "downloaded_free_product_unknown",
  ];

  const validIapProductStatus = [
    "has_downloaded_iap_product",
    "not_downloaded_free_product",
    "downloaded_iap_product_unknown",
  ];

  const tagMap: TagMaps = {
    subscription_status: "subscription_unknown",
    has_downloaded_free_product_status: "downloaded_free_product_unknown",
    has_downloaded_iap_product_status: "downloaded_iap_product_unknown",
    unknown_tags: [],
  };

  tagArray.forEach((tag) => {
    if (!tag) {
      return;
    }
    if (validSubscriptionStatus.includes(tag)) {
      tagMap.subscription_status = tag;
      return;
    }
    if (validFreeProductStatus.includes(tag)) {
      tagMap.has_downloaded_free_product_status = tag;
      return;
    }
    if (validIapProductStatus.includes(tag)) {
      tagMap.has_downloaded_iap_product_status = tag;
      return;
    }
    if (tag.includes("downloaded_free") && !tag.includes("not")) {
      tagMap.has_downloaded_free_product_status = "has_downloaded_free_product";
      return;
    }
    if (tag.includes("purchased") && !tag.includes("not")) {
      tagMap.has_downloaded_iap_product_status = "has_downloaded_iap_product";
      return;
    }
    if (tag.includes("not")) {
      tagMap.has_downloaded_free_product_status = "not_downloaded_free_product";
      return;
    }
    tagMap.unknown_tags.push(tag);
  });

  return tagMap;
}
