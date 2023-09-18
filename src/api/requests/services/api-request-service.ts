import AXIOS from "../../axios-instance";
import { API_URLS } from "../../urls";
import { Request } from "../request.interface";

export const createApiRequestService = () => {
  const list = async (searchOptions?: any): Promise<Request[]> => {
    const response = await AXIOS.get<Request[]>(
      API_URLS.REQUEST_LIST(searchOptions),
    );

    const requests = response.data || [];
    return requests;
  };

  const get = async (id: string): Promise<Request> => {
    const { data } = await AXIOS.get<Request>(API_URLS.REQUEST(id));

    return data;
  };

  const edit = async (id: string, body: Partial<Request>): Promise<void> => {
    await AXIOS.put(API_URLS.REQUEST(id), body);
  };

  const create = async (body: Partial<Request>): Promise<Request> => {
    const { data } = await AXIOS.post<Request>(API_URLS.REQUESTS, body);
    return data;
  };

  const destroy = async (id: string): Promise<void> => {
    await AXIOS.delete(API_URLS.REQUEST(id));
  };

  return {
    list,
    get,
    edit,
    create,
    destroy,
  };
};
