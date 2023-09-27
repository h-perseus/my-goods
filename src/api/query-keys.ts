const PRODUCT_LIST_KEY = (searchOptions?: any): [string] | [string, any] => {
  if (searchOptions === undefined) {
    return ["products"];
  }

  return ["products", searchOptions];
};

const PRODUCT_KEY = (
  id: string | undefined,
): readonly [string, string | undefined] => ["products", id];

const ADMIN_KEY = (id: string | null): readonly [string, string | null] => [
  "admin",
  id,
];

const REQUEST_LIST_KEY = (searchOptions?: any): [string] | [string, any] => {
  if (searchOptions === undefined) {
    return ["requests"];
  }

  return ["requests", searchOptions];
};

const REQUEST_KEY = (id: string): readonly [string, string] => ["requests", id];

const USER_LIST_KEY = (searchOptions?: any): [string] | [string, any] => {
  if (searchOptions === undefined) {
    return ["users"];
  }

  return ["users", searchOptions];
};

const USER_KEY = (id: string): readonly [string, string] => ["users", id];

const CONNECTION_LIST_KEY = (searchOptions?: any): [string] | [string, any] => {
  if (searchOptions === undefined) {
    return ["connections"];
  }

  return ["connections", searchOptions];
};

const CONNECTION_KEY = (id: string): readonly [string, string] => [
  "connections",
  id,
];

const DOMAIN_LIST_KEY = (searchOptions?: any): [string] | [string, any] => {
  if (searchOptions === undefined) {
    return ["domains"];
  }

  return ["domains", searchOptions];
};

const DOMAIN_KEY = (id: string): readonly [string, string] => ["domains", id];

const INFORMATION_KEY = (): readonly [string] => ["information"];

const QUERY_KEYS = {
  PRODUCT_LIST_KEY,
  REQUEST_LIST_KEY,
  USER_LIST_KEY,
  DOMAIN_LIST_KEY,
  CONNECTION_LIST_KEY,
  PRODUCT_KEY,
  REQUEST_KEY,
  USER_KEY,
  DOMAIN_KEY,
  CONNECTION_KEY,
  INFORMATION_KEY,
  ADMIN_KEY,
};

export default QUERY_KEYS;
