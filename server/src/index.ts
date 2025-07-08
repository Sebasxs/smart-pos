import './config/env.ts';
import express from 'express';
import cors from 'cors';
import productRoutes from '../src/routes/products.routes';
import invoiceRoutes from '../src/routes/invoices.routes';
import customerRoutes from '../src/routes/customers.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);

app.get('/', (req, res) => {
   res.json({
      status: 'online',
      system: 'AudiovideoFP POS API',
      version: '1.0.0',
   });
});

app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
