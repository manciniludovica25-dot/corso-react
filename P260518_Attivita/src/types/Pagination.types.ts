export type FilterType = "all" | "completed" | "notCompleted";

export type PaginationParams = {
    page: number;
    itemsPerPage: number;
    filter: FilterType;
};

export type PaginatedResponse<T> = {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
};
