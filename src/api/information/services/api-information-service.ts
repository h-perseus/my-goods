import { Information } from "../information.interface";
import AXIOS from "../../axios-instance";
import { API_URLS } from "../../urls";
import { LOCAL_STORAGE_KEYS } from "../../../helpers/local-storage-keys";

export const createApiInformationService = () => {
  const get = async (): Promise<Information> => {
    const { data } = await AXIOS.get<Information>(API_URLS.INFORMATION_GET(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHORIZED)|| ''));

    return data;
  };

  const edit = async (id: string, body: Partial<Information>): Promise<void> => {
    await AXIOS.put(API_URLS.INFORMATION_EDIT(id), body);
  };

  return {
    get,
    edit,
  };
};
