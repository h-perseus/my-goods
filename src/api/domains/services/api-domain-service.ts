import { Domain } from "../domain.interface";
import AXIOS from "../../axios-instance";
import { API_URLS } from "../../urls";

export const createApiDomainService = () => {
  const list = async (searchOptions?: any): Promise<Domain[]> => {
    const response = await AXIOS.get<Domain[]>(
      API_URLS.DOMAIN_LIST(searchOptions),
    );

    const domains = response.data || [];
    return domains;
  };

  const get = async (id: string): Promise<Domain> => {
    const { data } = await AXIOS.get<Domain>(API_URLS.DOMAIN(id));

    return data;
  };

  const edit = async (id: string, body: Partial<Domain>): Promise<void> => {
    await AXIOS.put(API_URLS.DOMAIN(id), body);
  };

  const create = async (body: Partial<Domain>): Promise<Domain> => {
    const { data } = await AXIOS.post<Domain>(API_URLS.DOMAINS, body);
    return data;
  };

  const destroy = async (id: string): Promise<void> => {
    await AXIOS.delete(API_URLS.DOMAIN(id));
  };

  return {
    list,
    get,
    edit,
    create,
    destroy,
  };
};
