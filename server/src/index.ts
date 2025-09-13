import './config/env';
import express from 'express';
import cors from 'cors';

import productRoutes from './routes/products.routes';
import invoiceRoutes from './routes/invoices.routes';
import customerRoutes from './routes/customers.routes';
import authRoutes from './routes/auth.routes';
import cashShiftRoutes from './routes/cash-shift.routes';
import settingsRoutes from './routes/settings.routes';
import printerRoutes from './routes/printer.routes';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
   'https://pos.audiovideofp.com',
   'https://pos.sebasxs.com',
   'http://localhost:5173',
   'http://localhost:3000',
];

app.use(
   cors({
      origin: (origin, callback) => {
         if (!origin) return callback(null, true);

         if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
         } else {
            console.error(`Bloqueado por CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
         }
      },
      credentials: true,
   }),
);
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cash_shifts', cashShiftRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/printer', printerRoutes);

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
