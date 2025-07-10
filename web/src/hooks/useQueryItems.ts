import { api } from "@helpers/api";

const useQueryItems = async (search: string = '', url: string) => {
  return api.get(`${url}?search=${search}`).then((e) => e.data.data);
};

export default useQueryItems;
