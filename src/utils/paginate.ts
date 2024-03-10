import { IRequest } from "./types";

const handlePaginate = (req: IRequest) => {
  let page: number = Number(req.query.page);

  let per_page: number = 10;

  const paginationOptions = {
    sort: { _id: -1 },
    skip: page >= 1 ? (page - 1) * per_page : 0,
    limit: per_page,
  };

  const meta = (count: number) => {
    const totalPages: number = Math.ceil(count / per_page);
    const nextPage = page + 1 <= totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return { totalPages, nextPage, prevPage };
  };

  return {
    paginationOptions,
    meta,
  };
};

export default handlePaginate;
