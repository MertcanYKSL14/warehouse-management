import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import { Warehouse } from '../types';
import { warehouseApi } from '../services/api';

interface Props {
    open: boolean;
    companyId: string;
    warehouse?: Warehouse | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function WarehouseModal({ open, companyId, warehouse, onClose, onSaved }: Props) {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (warehouse) {
            setName(warehouse.name);
            setLocation(warehouse.location);
            setDescription(warehouse.description || '');
        } else {
            setName('');
            setLocation('');
            setDescription('');
        }
    }, [warehouse, open]);

    const handleSave = async () => {
        if (!name || !location) return;
        setLoading(true);
        try {
            if (warehouse) {
                await warehouseApi.update({ Id: warehouse.id, CompanyId: companyId, Name: name, Location: location, Description: description });
            } else {
                await warehouseApi.create({ CompanyId: companyId, Name: name, Location: location, Description: description });
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
            <DialogTitle>{warehouse ? 'Depo Duzenle' : 'Yeni Depo Ekle'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField label="Depo Adi" fullWidth value={name} onChange={e => setName(e.target.value)} required />
                    <TextField label="Lokasyon" fullWidth value={location} onChange={e => setLocation(e.target.value)} required />
                    <TextField label="Aciklama" fullWidth multiline rows={2} value={description} onChange={e => setDescription(e.target.value)} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Ýptal</Button>
                <Button onClick={handleSave} variant="contained" disabled={loading}>
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}