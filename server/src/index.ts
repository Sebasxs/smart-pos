import './config/env';
import express from 'express';
import cors from 'cors';

import productRoutes from './routes/products.routes';
import invoiceRoutes from './routes/invoices.routes';
import customerRoutes from './routes/customers.routes';
import authRoutes from './routes/auth.routes';
import cashShiftRoutes from './routes/cash-shift.routes';
import settingsRoutes from './routes/settings.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cash_shifts', cashShiftRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (_, res) => {
   res.json({
      status: 'online',
      system: 'Smart POS API',
      version: '1.0.0',
   });
});

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
