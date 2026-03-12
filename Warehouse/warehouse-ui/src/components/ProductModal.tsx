import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from '@mui/material';
import { Product } from '../types';
import { productApi } from '../services/api';

interface Props {
    open: boolean;
    companyId: string;
    product?: Product | null;
    onClose: () => void;
    onSaved: () => void;
}

const CATEGORIES = ['Elektronik', 'Gida', 'Tekstil', 'Makine', 'Kimyasal', 'Diger'];
const UNITS = ['Adet', 'Kg', 'Litre', 'Metre', 'Kutu'];

export default function ProductModal({ open, companyId, product, onClose, onSaved }: Props) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [category, setCategory] = useState('');
    const [unit, setUnit] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setCode(product.code);
            setCategory(product.category);
            setUnit(product.unit);
            setDescription(product.description || '');
        } else {
            setName(''); setCode(''); setCategory(''); setUnit(''); setDescription('');
        }
    }, [product, open]);

    const handleSave = async () => {
        if (!name || !code || !category || !unit) return;
        setLoading(true);
        try {
            if (product) {
                await productApi.update({ Id: product.id, CompanyId: companyId, Name: name, Code: code, Category: category, Unit: unit, Description: description });
            } else {
                await productApi.create({ CompanyId: companyId, Name: name, Code: code, Category: category, Unit: unit, Description: description });
            }
            onSaved(); onClose();
        } catch { alert('Bir hata olustu.'); }
        finally { setLoading(false); }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{product ? 'Urun Duzenle' : 'Yeni Urun Ekle'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <TextField label="Urun Adi" fullWidth value={name} onChange={e => setName(e.target.value)} required />
                    <TextField label="Urun Kodu" fullWidth value={code} onChange={e => setCode(e.target.value)} required />
                    <TextField select label="Kategori" fullWidth value={category} onChange={e => setCategory(e.target.value)} required>
                        {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                    <TextField select label="Birim" fullWidth value={unit} onChange={e => setUnit(e.target.value)} required>
                        {UNITS.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                    </TextField>
                    <TextField label="Aciklama" fullWidth multiline rows={2} value={description} onChange={e => setDescription(e.target.value)} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Iptal</Button>
                <Button onClick={handleSave} variant="contained" disabled={loading}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</Button>
            </DialogActions>
        </Dialog>
    );
}