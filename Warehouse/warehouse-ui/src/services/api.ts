import axios from 'axios';
import { PagedResult, Product, Warehouse, Shelf, StockMovement } from '../types';

const BASE_URL = 'https://localhost:7112/api';

const api = axios.create({ baseURL: BASE_URL });

export const productApi = {
    getList: (companyId: string, page: number, pageSize: number, search?: string, category?: string) =>
        api.get<PagedResult<Product>>('/product/list', { params: { companyId, page, pageSize, search, category } }),
    getAll: (companyId: string) =>
        api.get<{ success: boolean; data: Product[] }>('/product/all', { params: { companyId } }),
    create: (dto: { CompanyId: string; Name: string; Code: string; Category: string; Unit: string; Description?: string }) =>
        api.post<{ success: boolean; data: Product }>('/product/create', dto),
    update: (dto: { Id: number; CompanyId: string; Name: string; Code: string; Category: string; Unit: string; Description?: string }) =>
        api.post<{ success: boolean; data: Product }>('/product/update', dto),
    delete: (dto: { Id: number; CompanyId: string }) =>
        api.post<{ success: boolean }>('/product/delete', dto),
};

export const warehouseApi = {
    getList: (companyId: string, page: number, pageSize: number, search?: string) =>
        api.get<PagedResult<Warehouse>>('/warehouse/list', { params: { companyId, page, pageSize, search } }),
    getAll: (companyId: string) =>
        api.get<{ success: boolean; data: Warehouse[] }>('/warehouse/all', { params: { companyId } }),
    create: (dto: { CompanyId: string; Name: string; Location: string; Description?: string }) =>
        api.post<{ success: boolean; data: Warehouse }>('/warehouse/create', dto),
    update: (dto: { Id: number; CompanyId: string; Name: string; Location: string; Description?: string }) =>
        api.post<{ success: boolean; data: Warehouse }>('/warehouse/update', dto),
    delete: (dto: { Id: number; CompanyId: string }) =>
        api.post<{ success: boolean }>('/warehouse/delete', dto),
};

export const shelfApi = {
    getList: (companyId: string, page: number, pageSize: number, search?: string, warehouseId?: number) =>
        api.get<PagedResult<Shelf>>('/shelf/list', { params: { companyId, page, pageSize, search, warehouseId } }),
    getByWarehouse: (warehouseId: number, companyId: string) =>
        api.get<{ success: boolean; data: Shelf[] }>(`/shelf/by-warehouse/${warehouseId}`, { params: { companyId } }),
    create: (dto: { CompanyId: string; Code: string; Capacity: number; WarehouseId: number }) =>
        api.post<{ success: boolean; data: Shelf }>('/shelf/create', dto),
    update: (dto: { Id: number; CompanyId: string; Code: string; Capacity: number; WarehouseId: number }) =>
        api.post<{ success: boolean; data: Shelf }>('/shelf/update', dto),
    delete: (dto: { Id: number; CompanyId: string }) =>
        api.post<{ success: boolean }>('/shelf/delete', dto),
};

export const stockMovementApi = {
    getList: (companyId: string, page: number, pageSize: number, productId?: number, type?: number) =>
        api.get<PagedResult<StockMovement>>('/stockmovement/list', { params: { companyId, page, pageSize, productId, type } }),
    getStock: (productId: number, companyId: string) =>
        api.get<{ success: boolean; stock: number }>(`/stockmovement/stock/${productId}`, { params: { companyId } }),
    create: (dto: { CompanyId: string; Type: number; Quantity: number; Note?: string; ProductId: number; ShelfId: number }) =>
        api.post<{ success: boolean; data: StockMovement }>('/stockmovement/create', dto),
};

export default api;