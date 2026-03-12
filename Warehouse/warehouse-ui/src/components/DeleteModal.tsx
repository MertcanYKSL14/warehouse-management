import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface Props {
    open: boolean;
    title: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function DeleteModal({ open, title, onConfirm, onClose }: Props) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Silme Onayi</DialogTitle>
            <DialogContent>
                <Typography>
                    <strong>{title}</strong> silinecek. Emin misiniz?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Iptal</Button>
                <Button onClick={onConfirm} color="error" variant="contained">Sil</Button>
            </DialogActions>
        </Dialog>
    );
}