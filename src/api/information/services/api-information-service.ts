import { Information } from "../information.interface";
import AXIOS from "../../axios-instance";
import { API_URLS } from "../../urls";

export const createApiInformationService = () => {
  const get = async (): Promise<Information> => {
    const { data } = await AXIOS.get<Information>(API_URLS.INFORMATION);

    return data;
  };

  const edit = async (body: Partial<Information>): Promise<void> => {
    await AXIOS.put(API_URLS.INFORMATION, body);
  };

  return {
    get,
    edit,
  };
};
