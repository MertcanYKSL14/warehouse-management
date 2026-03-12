export interface Product {
    id: number;
    companyId: string;
    name: string;
    code: string;
    category: string;
    unit: string;
    description?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface Warehouse {
    id: number;
    companyId: string;
    name: string;
    location: string;
    description?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface Shelf {
    id: number;
    companyId: string;
    code: string;
    capacity: number;
    warehouseId: number;
    warehouse?: Warehouse;
    isDeleted: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface StockMovement {
    id: number;
    companyId: string;
    type: 1 | 2;
    quantity: number;
    note?: string;
    productId: number;
    product?: Product;
    shelfId: number;
    shelf?: Shelf;
    createdAt: string;
}

export interface PagedResult<T> {
    success: boolean;
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export { };
