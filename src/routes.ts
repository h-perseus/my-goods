const HOME = "/";
const ADMIN = "/admin";
const PRODUCTS = "/products";
const REQUESTS = "/requests";
const DOMAINS = "/domains";
const CONNECTIONS = "/connections";
const USERS = "/users";
const INFORMATION = "/information";

const PRODUCT = `${PRODUCTS}/:productId`;
const REQUEST = `${REQUESTS}/:requestId`;
const REQUEST_FINISHED = `${REQUESTS}/finished/:requestId`;
const USER = `${USERS}/:id`;
const CONNECTION = `${CONNECTIONS}/:id`;
const DOMAIN = `${DOMAINS}/:id`;

const PRODUCT_CREATE = `${PRODUCTS}/new`;
const PRODUCT_CONFIRM = `${PRODUCT}/confirm`;
const PRODUCT_LOGIN = `${PRODUCT}/login`;
const PRODUCT_EDIT = `${PRODUCTS}/edit/:productId`;
const REQUEST_CREATE = `${REQUESTS}/new/:productId`;
const DOMAIN_CREATE = `${DOMAINS}/new`;
const DOMAIN_EDIT = `${DOMAINS}/edit/:domainId`;

const ROUTER_PATHS = {
  HOME,
  ADMIN,
  LANDING_PAGE: HOME,
  PRODUCTS,
  PRODUCT,
  PRODUCT_CREATE,
  PRODUCT_EDIT,
  REQUESTS,
  REQUEST,
  REQUEST_CREATE,
  INFORMATION,
  DOMAIN_CREATE,
  DOMAINS,
  DOMAIN,
  CONNECTION,
  CONNECTIONS,
  DOMAIN_EDIT,
  REQUEST_FINISHED,
  USER,
  USERS,
  PRODUCT_CONFIRM,
  PRODUCT_LOGIN,
};

const getProductUrl = (id: string): string => encodeURI(`${PRODUCTS}/${id}`);
const getProductConfirmUrl = (id: string): string =>
  encodeURI(`${PRODUCTS}/${id}/confirm`);
const getProductLoginUrl = (id: string): string =>
  encodeURI(`${PRODUCTS}/${id}/login`);

const getProductEditUrl = (id: string): string =>
  encodeURI(`${PRODUCTS}/edit/${id}`);

const getDomainEditUrl = (id: string): string =>
  encodeURI(`${DOMAINS}/edit/${id}`);

const getRequestUrl = (id: string): string => encodeURI(`${REQUESTS}/${id}`);

const getRequestFinishedUrl = (id: string): string =>
  encodeURI(`${REQUESTS}/finished/${id}`);

const PATHS = {
  getProductUrl,
  getProductEditUrl,
  getRequestUrl,
  getDomainEditUrl,
  getRequestFinishedUrl,
  getProductConfirmUrl,
  getProductLoginUrl,
};

export { ROUTER_PATHS, PATHS };
