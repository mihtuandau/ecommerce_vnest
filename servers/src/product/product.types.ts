// Product create/update payloads and search filters are deeply dynamic
// (variant/image batch create-or-update, category/brand relation connects,
// price-range/stock/rating search filters built conditionally in the
// service). Rather than force a brittle one-to-one DTO over that
// complexity, these stay intentionally loose — but named/owned here
// instead of importing `Prisma.ProductCreateInput` / `WhereInput` /
// `UpdateInput` at the repository boundary.
export type ProductCreateData = Record<string, any>;
export type ProductUpdateData = Record<string, any>;
export type ProductFilter = Record<string, any>;
