"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlePaginate = (req) => {
    let page = Number(req.query.page);
    let per_page = 10;
    const paginationOptions = {
        sort: { _id: -1 },
        skip: page >= 1 ? (page - 1) * per_page : 0,
        limit: per_page,
    };
    const meta = (count) => {
        const totalPages = Math.ceil(count / per_page);
        const nextPage = page + 1 <= totalPages ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
        return { totalPages, nextPage, prevPage };
    };
    return {
        paginationOptions,
        meta,
    };
};
exports.default = handlePaginate;
//# sourceMappingURL=paginate.js.map