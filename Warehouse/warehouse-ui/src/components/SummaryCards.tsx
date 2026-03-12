import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { productApi, warehouseApi, shelfApi, stockMovementApi } from '../services/api';

interface Props {
    companyId: string;
    refresh: number;
}

export default function SummaryCards({ companyId, refresh }: Props) {
    const [productCount, setProductCount] = useState(0);
    const [warehouseCount, setWarehouseCount] = useState(0);
    const [shelfCount, setShelfCount] = useState(0);
    const [inCount, setInCount] = useState(0);
    const [outCount, setOutCount] = useState(0);

    useEffect(() => {
        if (!companyId) return;
        const load = async () => {
            try {
                const [p, w, s, i, o] = await Promise.all([
                    productApi.getList(companyId, 1, 1),
                    warehouseApi.getList(companyId, 1, 1),
                    shelfApi.getList(companyId, 1, 1),
                    stockMovementApi.getList(companyId, 1, 1, undefined, 1),
                    stockMovementApi.getList(companyId, 1, 1, undefined, 2),
                ]);
                setProductCount(p.data.totalCount);
                setWarehouseCount(w.data.totalCount);
                setShelfCount(s.data.totalCount);
                setInCount(i.data.totalCount);
                setOutCount(o.data.totalCount);
            } catch (err) {
                console.error('SummaryCards hata:', err);
            }
        };
        load();
    }, [companyId, refresh]);

    const cards = [
        { title: 'Toplam Urun', value: productCount, icon: <Inventory2Icon fontSize="large" />, color: '#1976d2' },
        { title: 'Toplam Depo', value: warehouseCount, icon: <WarehouseIcon fontSize="large" />, color: '#388e3c' },
        { title: 'Toplam Raf', value: shelfCount, icon: <ViewModuleIcon fontSize="large" />, color: '#f57c00' },
        { title: 'Stok Girisi', value: inCount, icon: <TrendingUpIcon fontSize="large" />, color: '#7b1fa2' },
        { title: 'Stok Cikisi', value: outCount, icon: <TrendingDownIcon fontSize="large" />, color: '#c62828' },
    ];

    return (
        <Box display="flex" flexWrap="wrap" gap={2} sx={{ mb: 3 }}>
            {cards.map((card) => (
                <Box key={card.title} sx={{ flex: '1 1 150px', minWidth: 150 }}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" color="text.secondary">{card.title}</Typography>
                                    <Typography variant="h4" fontWeight="bold">{card.value}</Typography>
                                </Box>
                                <Box sx={{ color: card.color }}>{card.icon}</Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </Box>
    );
}