import { Product } from "../product.interface";
import AXIOS from "../../axios-instance";
import { API_URLS } from "../../urls";

export const createApiProductService = () => {
  const list = async (searchOptions?: any): Promise<any> => {
    const response = await AXIOS.get<any>(
      API_URLS.PRODUCT_LIST(searchOptions),
    );

    const productsList = response.data || [];
    return productsList;
  };

  const get = async (code: string): Promise<Product> => {
    const { data } = await AXIOS.get<Product>(API_URLS.PRODUCT_BY_CODE(code));

    return data;
  };

  const edit = async (id: string, body: Partial<Product>): Promise<void> => {
    if (!body.image) throw Error("이미지를 입력하세요");
    if (typeof body.image !== "string") {
      const formData = new FormData();
      formData.append("image", body.image);
      const res = await AXIOS.post(API_URLS.IMAGE_UPLOAD, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      body.image = res.data.path;
    }
    await AXIOS.put(API_URLS.PRODUCT(id), body);
  };

  const create = async (
    body: Partial<Product>,
  ): Promise<Product | undefined> => {
    if (!body.image) throw Error("이미지를 입력하세요");
    if (typeof body.image !== "string") {
      const formData = new FormData();
      formData.append("image", body.image);
      const res = await AXIOS.post(API_URLS.IMAGE_UPLOAD, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      body.image = res.data.path;
    }

    const { data } = await AXIOS.post<Product>(API_URLS.PRODUCTS, body);
    return data;
  };

  const destroy = async (id: string): Promise<void> => {
    await AXIOS.delete(API_URLS.PRODUCT(id));
  };

  return {
    list,
    get,
    edit,
    create,
    destroy,
  };
};
