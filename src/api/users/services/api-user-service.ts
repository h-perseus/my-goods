import { User } from "../user.interface";
import AXIOS from "../../axios-instance";
import { API_URLS } from "../../urls";

export const createApiUserService = () => {
  const list = async (searchOptions?: any): Promise<User[]> => {
    const response = await AXIOS.get<User[]>(API_URLS.USER_LIST(searchOptions));

    const users = response.data || [];
    return users;
  };

  const get = async (id: string): Promise<User> => {
    const { data } = await AXIOS.get<User>(API_URLS.USER(id));

    return data;
  };
  const getAdmin = async (id: string): Promise<User> => {
    const { data } = await AXIOS.get<User>(API_URLS.ADMIN(id));

    return data;
  };

  const edit = async (id: string, body: Partial<User>): Promise<void> => {
    await AXIOS.put(API_URLS.USER(id), body);
  };

  const create = async (body: Partial<User>): Promise<User> => {
    const { data } = await AXIOS.post<User>(API_URLS.USERS, body);
    return data;
  };

  const destroy = async (id: string): Promise<void> => {
    await AXIOS.delete(API_URLS.USER(id));
  };

  return {
    list,
    get,
    edit,
    create,
    destroy,
    getAdmin,
  };
};
