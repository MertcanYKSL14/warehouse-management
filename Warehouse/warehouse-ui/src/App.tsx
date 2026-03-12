import { useState, useEffect, useCallback } from 'react';
import {
    Container, Box, Typography, Button, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Pagination, Chip,
    AppBar, Toolbar, Tabs, Tab
} from '@mui/material';
import WarehouseModal from './components/WarehouseModal';
import ShelfModal from './components/ShelfModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Product, Warehouse, Shelf, StockMovement } from './types';
import { productApi, warehouseApi, shelfApi, stockMovementApi } from './services/api';
import SummaryCards from './components/SummaryCards';
import ProductModal from './components/ProductModal';
import StockMovementModal from './components/StockMovementModal';
import DeleteModal from './components/DeleteModal';

const COMPANY_ID = 'COMP001';

export default function App() {
    const [tab, setTab] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [productTotal, setProductTotal] = useState(0);
    const [productPage, setProductPage] = useState(1);
    const [productSearch, setProductSearch] = useState('');
    const [productModal, setProductModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteProductModal, setDeleteProductModal] = useState(false);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [warehouseTotal, setWarehouseTotal] = useState(0);
    const [warehousePage, setWarehousePage] = useState(1);
    const [warehouseSearch, setWarehouseSearch] = useState('');
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [shelfTotal, setShelfTotal] = useState(0);
    const [shelfPage, setShelfPage] = useState(1);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [movementTotal, setMovementTotal] = useState(0);
    const [movementPage, setMovementPage] = useState(1);
    const [movementModal, setMovementModal] = useState(false);
    const [warehouseModal, setWarehouseModal] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const [shelfModal, setShelfModal] = useState(false);
    const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
    const [deleteWarehouseModal, setDeleteWarehouseModal] = useState(false);
    const [deleteShelfModal, setDeleteShelfModal] = useState(false);

    const PAGE_SIZE = 25;

    const loadProducts = useCallback(async () => {
        try {
            const r = await productApi.getList(COMPANY_ID, productPage, PAGE_SIZE, productSearch);
            setProducts(r.data.data);
            setProductTotal(r.data.totalPages);
        } catch (err) { console.error('loadProducts hata:', err); }
    }, [productPage, productSearch]);

    const loadWarehouses = useCallback(async () => {
        try {
            const r = await warehouseApi.getList(COMPANY_ID, warehousePage, PAGE_SIZE, warehouseSearch);
            setWarehouses(r.data.data);
            setWarehouseTotal(r.data.totalPages);
        } catch (err) { console.error('loadWarehouses hata:', err); }
    }, [warehousePage, warehouseSearch]);

    const loadShelves = useCallback(async () => {
        try {
            const r = await shelfApi.getList(COMPANY_ID, shelfPage, PAGE_SIZE);
            setShelves(r.data.data);
            setShelfTotal(r.data.totalPages);
        } catch (err) { console.error('loadShelves hata:', err); }
    }, [shelfPage]);

    const loadMovements = useCallback(async () => {
        try {
            const r = await stockMovementApi.getList(COMPANY_ID, movementPage, PAGE_SIZE);
            setMovements(r.data.data);
            setMovementTotal(r.data.totalPages);
        } catch (err) { console.error('loadMovements hata:', err); }
    }, [movementPage]);

    useEffect(() => { loadProducts(); }, [loadProducts, refresh]);
    useEffect(() => { loadWarehouses(); }, [loadWarehouses, refresh]);
    useEffect(() => { loadShelves(); }, [loadShelves, refresh]);
    useEffect(() => { loadMovements(); }, [loadMovements, refresh]);

    const handleRefresh = () => setRefresh(r => r + 1);

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        await productApi.delete({ Id: selectedProduct.id, CompanyId: COMPANY_ID });
        setDeleteProductModal(false);
        setSelectedProduct(null);
        handleRefresh();
    };
    const handleDeleteWarehouse = async () => {
        if (!selectedWarehouse) return;
        await warehouseApi.delete({ Id: selectedWarehouse.id, CompanyId: COMPANY_ID });
        setDeleteWarehouseModal(false);
        setSelectedWarehouse(null);
        handleRefresh();
    };
    const handleDeleteShelf = async () => {
        if (!selectedShelf) return;
        await shelfApi.delete({ Id: selectedShelf.id, CompanyId: COMPANY_ID });
        setDeleteShelfModal(false);
        setSelectedShelf(null);
        handleRefresh();
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" fontWeight="bold">🏭 Akıllı Depo Yönetimi</Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 3 }}>
                <SummaryCards companyId={COMPANY_ID} refresh={refresh} />

                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                    <Tab label="Urunler" />
                    <Tab label="Depolar" />
                    <Tab label="Raflar" />
                    <Tab label="Stok Hareketleri" />
                </Tabs>

                {tab === 0 && (
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <TextField label="Urun Ara..." size="small" value={productSearch}
                                onChange={e => { setProductSearch(e.target.value); setProductPage(1); }} />
                            <Button variant="contained" startIcon={<AddIcon />}
                                onClick={() => { setSelectedProduct(null); setProductModal(true); }}>
                                Yeni Ürün
                            </Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                        <TableCell sx={{ color: 'white' }}>ID</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Ad</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Kod</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Kategori</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Birim</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Açıklama</TableCell>
                                        <TableCell sx={{ color: 'white' }}>İşlem</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map(p => (
                                        <TableRow key={p.id} hover>
                                            <TableCell>{p.id}</TableCell>
                                            <TableCell>{p.name}</TableCell>
                                            <TableCell><Chip label={p.code} size="small" /></TableCell>
                                            <TableCell>{p.category}</TableCell>
                                            <TableCell>{p.unit}</TableCell>
                                            <TableCell>{p.description || '-'}</TableCell>
                                            <TableCell>
                                                <IconButton color="primary" onClick={() => { setSelectedProduct(p); setProductModal(true); }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => { setSelectedProduct(p); setDeleteProductModal(true); }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Pagination count={productTotal} page={productPage} onChange={(_, v) => setProductPage(v)} color="primary" />
                        </Box>
                    </Box>
                )}

                {tab === 1 && (
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <TextField label="Depo Ara..." size="small" value={warehouseSearch}
                                onChange={e => { setWarehouseSearch(e.target.value); setWarehousePage(1); }} />
                            <Button variant="contained" startIcon={<AddIcon />}
                                onClick={() => { setSelectedWarehouse(null); setWarehouseModal(true); }}>
                                Yeni Depo
                            </Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#388e3c' }}>
                                        <TableCell sx={{ color: 'white' }}>ID</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Ad</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Lokasyon</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Aciklama</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Islem</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {warehouses.map(w => (
                                        <TableRow key={w.id} hover>
                                            <TableCell>{w.id}</TableCell>
                                            <TableCell>{w.name}</TableCell>
                                            <TableCell>{w.location}</TableCell>
                                            <TableCell>{w.description || '-'}</TableCell>
                                            <TableCell>
                                                <IconButton color="primary" onClick={() => { setSelectedWarehouse(w); setWarehouseModal(true); }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => { setSelectedWarehouse(w); setDeleteWarehouseModal(true); }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Pagination count={warehouseTotal} page={warehousePage} onChange={(_, v) => setWarehousePage(v)} color="primary" />
                        </Box>
                    </Box>
                )}

                {tab === 2 && (
                    <Box>
                        <Box display="flex" justifyContent="flex-end" mb={2}>
                            <Button variant="contained" startIcon={<AddIcon />}
                                onClick={() => { setSelectedShelf(null); setShelfModal(true); }}>
                                Yeni Raf
                            </Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f57c00' }}>
                                        <TableCell sx={{ color: 'white' }}>ID</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Kod</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Kapasite</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Depo</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Islem</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shelves.map(s => (
                                        <TableRow key={s.id} hover>
                                            <TableCell>{s.id}</TableCell>
                                            <TableCell>{s.code}</TableCell>
                                            <TableCell>{s.capacity}</TableCell>
                                            <TableCell>{s.warehouse?.name || '-'}</TableCell>
                                            <TableCell>
                                                <IconButton color="primary" onClick={() => { setSelectedShelf(s); setShelfModal(true); }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => { setSelectedShelf(s); setDeleteShelfModal(true); }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Pagination count={shelfTotal} page={shelfPage} onChange={(_, v) => setShelfPage(v)} color="primary" />
                        </Box>
                    </Box>
                )}

                {tab === 3 && (
                    <Box>
                        <Box display="flex" justifyContent="flex-end" mb={2}>
                            <Button variant="contained" startIcon={<TrendingUpIcon />} onClick={() => setMovementModal(true)}>
                                Stok Hareketi Ekle
                            </Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#7b1fa2' }}>
                                        <TableCell sx={{ color: 'white' }}>ID</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Tip</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Ürün</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Raf</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Miktar</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Not</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Tarih</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {movements.map(m => (
                                        <TableRow key={m.id} hover>
                                            <TableCell>{m.id}</TableCell>
                                            <TableCell>
                                                <Chip label={m.type === 1 ? 'Giris' : 'Cikis'} color={m.type === 1 ? 'success' : 'error'} size="small" />
                                            </TableCell>
                                            <TableCell>{m.product?.name || '-'}</TableCell>
                                            <TableCell>{m.shelf?.code || '-'}</TableCell>
                                            <TableCell>{m.quantity}</TableCell>
                                            <TableCell>{m.note || '-'}</TableCell>
                                            <TableCell>{new Date(m.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Pagination count={movementTotal} page={movementPage} onChange={(_, v) => setMovementPage(v)} color="primary" />
                        </Box>
                    </Box>
                )}
            </Container>

            <ProductModal open={productModal} companyId={COMPANY_ID} product={selectedProduct}
                onClose={() => setProductModal(false)} onSaved={handleRefresh} />
            <StockMovementModal open={movementModal} companyId={COMPANY_ID} products={products}
                onClose={() => setMovementModal(false)} onSaved={handleRefresh} />
            <DeleteModal open={deleteProductModal} title={selectedProduct?.name || ''}
                onConfirm={handleDeleteProduct} onClose={() => setDeleteProductModal(false)} />
            <WarehouseModal open={warehouseModal} companyId={COMPANY_ID} warehouse={selectedWarehouse}
                onClose={() => setWarehouseModal(false)} onSaved={handleRefresh} />
            <ShelfModal open={shelfModal} companyId={COMPANY_ID} shelf={selectedShelf}
                onClose={() => setShelfModal(false)} onSaved={handleRefresh} />
            <DeleteModal open={deleteWarehouseModal} title={selectedWarehouse?.name || ''}
                onConfirm={handleDeleteWarehouse} onClose={() => setDeleteWarehouseModal(false)} />
            <DeleteModal open={deleteShelfModal} title={selectedShelf?.code || ''}
                onConfirm={handleDeleteShelf} onClose={() => setDeleteShelfModal(false)} />
        </Box>
    );
}
export { };