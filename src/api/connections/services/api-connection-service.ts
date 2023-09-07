import { Connection } from "../connection.interface";
import AXIOS from '../../axios-instance';
import { API_URLS } from "../../urls";

export const createApiConnectionService = () => {
  const list = async (
    searchOptions?: any
  ): Promise<Connection[]> => {

    const response = await AXIOS.get<Connection[]>(
      API_URLS.CONNECTION_LIST(searchOptions)
    );

    const connections = response.data || [];
    return connections
  };

  const get = async (
    id: string
  ): Promise<Connection> => {
    const { data } = await AXIOS.get<Connection>(API_URLS.CONNECTION(id));

    return data;
  };

  const edit = async (
    id: string,
    body: Partial<Connection>
  ): Promise<void> => {
    await AXIOS.put(API_URLS.CONNECTION(id), body);
  };

  const create = async (body: Partial<Connection>): Promise<Connection> => {
    const { data: ipData} = await AXIOS.get('https://api.ipify.org?format=json');
    body.ip = ipData.ip;
    const { data } = await AXIOS.post<Connection>(API_URLS.CONNECTIONS, body);
    return data;
  };

  const destroy = async (
    id: string
  ): Promise<void> => {
    await AXIOS.delete(API_URLS.CONNECTION(id));
  };

  return {
    list,
    get,
    edit,
    create,
    destroy
  };
};
