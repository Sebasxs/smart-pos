const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
   name: 'SmartPOS Printer Agent',
   description: 'Servicio de impresión automática para Smart POS Web.',
   script: path.join(__dirname, 'index.js'),
   nodeOptions: ['--harmony', '--max_old_space_size=4096'],
   workingDirectory: __dirname,
});

svc.on('install', function () {
   console.log('✅ Servicio instalado correctamente.');
   console.log('🚀 Iniciando servicio...');
   svc.start();
});

svc.on('alreadyinstalled', function () {
   console.log('⚠️  El servicio ya estaba instalado.');
   console.log('Intentando iniciar...');
   svc.start();
});

svc.on('start', function () {
   console.log('⚡ El servicio se ha iniciado y está corriendo en segundo plano.');
});

svc.install();
