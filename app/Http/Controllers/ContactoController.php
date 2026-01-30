<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactoMail;
 
class ContactoController extends Controller
{
    public function enviar(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'email' => 'required|email',
            'telefono' => 'nullable|string',
            'empresa' => 'nullable|string',
            'mensaje' => 'required|string',
        ]);

        Mail::to('info@aquahealth.com.bo')->send(new ContactoMail($request->all()));

        return response()->json([
            'message' => '¡Formulario enviado correctamente!'
        ]);
    }
}
