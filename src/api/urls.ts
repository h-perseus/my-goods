const PRODUCTS = `${process.env.REACT_APP_API_URL}/products`;
const REQUESTS = `${process.env.REACT_APP_API_URL}/requests`;
const USERS = `${process.env.REACT_APP_API_URL}/users`;
const ADMINS = `${process.env.REACT_APP_API_URL}/admins`;
const CONNECTIONS = `${process.env.REACT_APP_API_URL}/connections`;
const DOMAINS = `${process.env.REACT_APP_API_URL}/domains`;
const INFORMATION = `${process.env.REACT_APP_API_URL}/information`;
const IMAGE_UPLOAD = `${process.env.REACT_APP_API_URL}/image_upload`;

const PRODUCT_LIST = (searchOptions?: any): string => {
  const baseUrl = `${PRODUCTS}`;
  const searchOptionsUrl = new URLSearchParams();

  if (searchOptions) {
    for (const key in searchOptions) {
      if (searchOptions.hasOwnProperty(key)) {
        searchOptionsUrl.set(key, searchOptions[key]);
      }
    }
  }
  return `${baseUrl}?${searchOptionsUrl.toString()}`;
};

const REQUEST_LIST = (searchOptions?: any): string => {
  const baseUrl = `${REQUESTS}`;
  const searchOptionsUrl = new URLSearchParams();

  if (searchOptions) {
    for (const key in searchOptions) {
      if (searchOptions.hasOwnProperty(key)) {
        searchOptionsUrl.set(key, searchOptions[key]);
      }
    }
  }
  return `${baseUrl}?${searchOptionsUrl.toString()}`;
};

const USER_LIST = (searchOptions?: any): string => {
  const baseUrl = `${USERS}`;
  const searchOptionsUrl = new URLSearchParams();

  if (searchOptions) {
    for (const key in searchOptions) {
      if (searchOptions.hasOwnProperty(key)) {
        searchOptionsUrl.set(key, searchOptions[key]);
      }
    }
  }
  return `${baseUrl}?${searchOptionsUrl.toString()}`;
};

const DOMAIN_LIST = (searchOptions?: any): string => {
  const baseUrl = `${DOMAINS}`;
  const searchOptionsUrl = new URLSearchParams();

  if (searchOptions) {
    for (const key in searchOptions) {
      if (searchOptions.hasOwnProperty(key)) {
        searchOptionsUrl.set(key, searchOptions[key]);
      }
    }
  }
  return `${baseUrl}?${searchOptionsUrl.toString()}`;
};

const CONNECTION_LIST = (searchOptions?: any): string => {
  const baseUrl = `${CONNECTIONS}`;
  const searchOptionsUrl = new URLSearchParams();

  if (searchOptions) {
    for (const key in searchOptions) {
      if (searchOptions.hasOwnProperty(key)) {
        searchOptionsUrl.set(key, searchOptions[key]);
      }
    }
  }
  return `${baseUrl}?${searchOptionsUrl.toString()}`;
};

const PRODUCT = (id: string): string => `${PRODUCTS}/${id}`;
const PRODUCT_BY_CODE = (id: string): string => `${PRODUCTS}/getByCode/${id}`;
const REQUEST = (id: string): string => `${REQUESTS}/${id}`;
const DOMAIN = (id: string): string => `${DOMAINS}/${id}`;
const USER = (id: string): string => `${USERS}/${id}`;
const ADMIN = (id: string): string => `${ADMINS}/${id}`;
const CONNECTION = (id: string): string => `${CONNECTIONS}/${id}`;
const INFORMATION_GET = (admin: string): string => 
{
  const baseUrl = `${INFORMATION}`;
  const searchOptionsUrl = new URLSearchParams();
  if (admin) {
    searchOptionsUrl.set('admin', admin);
  }
  return `${baseUrl}?${searchOptionsUrl.toString()}`;
}
const INFORMATION_EDIT = (id: string): string => 
`${INFORMATION}/${id}`;

export const API_URLS = {
  PRODUCTS,
  PRODUCT_LIST,
  PRODUCT,
  REQUESTS,
  REQUEST_LIST,
  REQUEST,
  DOMAINS,
  DOMAIN_LIST,
  DOMAIN,
  INFORMATION,
  INFORMATION_GET,
  INFORMATION_EDIT,
  CONNECTIONS,
  CONNECTION_LIST,
  CONNECTION,
  USERS,
  USER_LIST,
  USER,
  IMAGE_UPLOAD,
  PRODUCT_BY_CODE,
  ADMIN,
};
