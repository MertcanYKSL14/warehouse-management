import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from '@mui/material';
import { Product, Shelf, Warehouse } from '../types';
import { stockMovementApi, shelfApi, warehouseApi } from '../services/api';

interface Props {
    open: boolean;
    companyId: string;
    products: Product[];
    onClose: () => void;
    onSaved: () => void;
}

export default function StockMovementModal({ open, companyId, products, onClose, onSaved }: Props) {
    const [type, setType] = useState<number>(1);
    const [productId, setProductId] = useState<number>(0);
    const [shelfId, setShelfId] = useState<number>(0);
    const [warehouseId, setWarehouseId] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [note, setNote] = useState('');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            warehouseApi.getAll(companyId).then(r => setWarehouses(r.data.data));
            setProductId(0); setShelfId(0); setWarehouseId(0); setQuantity(1); setNote(''); setType(1);
        }
    }, [open, companyId]);

    useEffect(() => {
        if (warehouseId) {
            shelfApi.getByWarehouse(warehouseId, companyId).then(r => setShelves(r.data.data));
        } else { setShelves([]); }
    }, [warehouseId, companyId]);

    const handleSave = async () => {
        if (!productId || !shelfId || quantity <= 0) return;
        setLoading(true);
        try {
            await stockMovementApi.create({ CompanyId: companyId, Type: type, Quantity: quantity, Note: note, ProductId: productId, ShelfId: shelfId });
            onSaved(); onClose();
        } catch (err: any) { alert(err?.response?.data || 'Bir hata oluþtu.'); }
        finally { setLoading(false); }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Stok Hareketi Ekle</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField select label="Hareket Tipi" fullWidth value={type} onChange={e => setType(Number(e.target.value))}>
                        <MenuItem value={1}>Giris</MenuItem>
                        <MenuItem value={2}>Cikis</MenuItem>
                    </TextField>
                    <TextField select label="Urun" fullWidth value={productId} onChange={e => setProductId(Number(e.target.value))}>
                        <MenuItem value={0}>Seciniz</MenuItem>
                        {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                    </TextField>
                    <TextField select label="Depo" fullWidth value={warehouseId} onChange={e => setWarehouseId(Number(e.target.value))}>
                        <MenuItem value={0}>Seciniz</MenuItem>
                        {warehouses.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
                    </TextField>
                    <TextField select label="Raf" fullWidth value={shelfId} onChange={e => setShelfId(Number(e.target.value))}>
                        <MenuItem value={0}>Seciniz</MenuItem>
                        {shelves.map(s => <MenuItem key={s.id} value={s.id}>{s.code}</MenuItem>)}
                    </TextField>
                    <TextField label="Miktar" type="number" fullWidth value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
                    <TextField label="Not" fullWidth value={note} onChange={e => setNote(e.target.value)} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Iptal</Button>
                <Button onClick={handleSave} variant="contained" disabled={loading}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</Button>
            </DialogActions>
        </Dialog>
    );
}