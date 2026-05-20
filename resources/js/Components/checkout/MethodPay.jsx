import React from "react";
import { PAYMENT_METHODS } from "@/Config/paymentMethods";

export default function MethodPay({ method, setMethod }) {
  return (
    <div className="bg-white border border-grayCustom rounded-2xl p-6 mb-6 shadow-lg">
      <h3 className="text-darkGray font-bold text-2xl mb-5 border-b border-grayCustom pb-3">
        Método de Pago
      </h3>

      {PAYMENT_METHODS.map((pm) => (
        <div key={pm.value} className="mb-5">
          <label
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setMethod(pm.value)}
          >
            <input
              type="radio"
              value={pm.value}
              checked={method === pm.value}
              readOnly
              className="w-5 h-5 accent-turquoise"
            />
            <span className="text-darkGray font-medium">{pm.label}</span>
          </label>

          <div
            className={`mt-3 border border-grayCustom rounded-xl bg-gray-50 overflow-hidden transition-all duration-500 ease-out ${
              method === pm.value ? "max-h-[600px]" : "max-h-0"
            }`}
          >
            {pm.type === 'bank' && pm.details && (
              <div className="p-5 space-y-3">
                <p className="text-darkGray font-semibold text-lg">
                  Realiza tu pago mediante transferencia bancaria:
                </p>
                <div className="text-darkGray text-sm space-y-1">
                  <p><span className="font-semibold">Titular:</span> {pm.details.titular}</p>
                  {pm.details.rut && <p><span className="font-semibold">RUT:</span> {pm.details.rut}</p>}
                  <p><span className="font-semibold">Banco:</span> {pm.details.banco}</p>
                  <p><span className="font-semibold">Tipo de cuenta:</span> {pm.details.tipoCuenta}</p>
                  <p><span className="font-semibold">N° de cuenta:</span> {pm.details.numeroCuenta}</p>
                  <p><span className="font-semibold">Correo:</span> {pm.details.correo}</p>
                </div>
                <p className="text-grayCustom text-sm leading-relaxed pt-2">
                  Usa el <strong>número del pedido enviado a tu correo</strong> como referencia.<br />
                  El pedido será procesado una vez confirmado el pago.
                </p>
              </div>
            )}

            {pm.type === 'qr' && (
              <div className="p-5 space-y-4 text-center">
                <p className="text-darkGray font-semibold text-lg">
                  Escanea el código QR para realizar el pago
                </p>
                {pm.qrImage && (
                  <div className="flex justify-center">
                    <img src={pm.qrImage} alt="Código QR de pago" className="max-w-[200px]" />
                  </div>
                )}
                <p className="text-grayCustom text-sm leading-relaxed">
                  Una vez realizado el pago, el pedido será procesado tras la validación.
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
