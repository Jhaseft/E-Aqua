export const PAYMENT_METHODS = [
  {
    id: 2,
    value: 'transfer',
    label: 'Transferencia Bancaria',
    type: 'bank',
    details: {
      titular: 'Mackarena Soledad Rojas Aedo',
      rut: '16.674.889-5',
      banco: 'Mercado Pago',
      tipoCuenta: 'Cuenta Vista',
      numeroCuenta: '1017445099',
      correo: 'rojasaedomackarena@gmail.com',
    },
  },
  {
    id: 1,
    value: 'qr',
    label: 'Pago mediante QR',
    type: 'qr',
    qrImage: '',
  },
];
