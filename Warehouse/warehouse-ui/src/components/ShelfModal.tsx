import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, MenuItem } from '@mui/material';
import { Shelf, Warehouse } from '../types';
import { shelfApi, warehouseApi } from '../services/api';

interface Props {
    open: boolean;
    companyId: string;
    shelf?: Shelf | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function ShelfModal({ open, companyId, shelf, onClose, onSaved }: Props) {
    const [code, setCode] = useState('');
    const [capacity, setCapacity] = useState(100);
    const [warehouseId, setWarehouseId] = useState(0);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            warehouseApi.getAll(companyId).then((r: any) => setWarehouses(r.data.data));
        }
        if (shelf) {
            setCode(shelf.code);
            setCapacity(shelf.capacity);
            setWarehouseId(shelf.warehouseId);
        } else {
            setCode('');
            setCapacity(100);
            setWarehouseId(0);
        }
    }, [shelf, open, companyId]);

    const handleSave = async () => {
        if (!code || !warehouseId) return;
        setLoading(true);
        try {
            if (shelf) {
                await shelfApi.update({ Id: shelf.id, CompanyId: companyId, Code: code, Capacity: capacity, WarehouseId: warehouseId });
            } else {
                await shelfApi.create({ CompanyId: companyId, Code: code, Capacity: capacity, WarehouseId: warehouseId });
            }
            onSaved();
            onClose();
        } catch {
            alert('Bir hata olustu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{shelf ? 'Raf Duzenle' : 'Yeni Raf Ekle'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField label="Raf Kodu" fullWidth value={code} onChange={e => setCode(e.target.value)} required />
                    <TextField label="Kapasite" type="number" fullWidth value={capacity} onChange={e => setCapacity(Number(e.target.value))} />
                    <TextField select label="Depo" fullWidth value={warehouseId} onChange={e => setWarehouseId(Number(e.target.value))} required>
                        <MenuItem value={0}>Seciniz</MenuItem>
                        {warehouses.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Iptal</Button>
                <Button onClick={handleSave} variant="contained" disabled={loading}>
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}