<h2>Nuevo mensaje de contacto</h2>
<p><strong>Nombre:</strong> {{ $data['nombre'] }}</p>
<p><strong>Email:</strong> {{ $data['email'] }}</p>
<p><strong>Teléfono:</strong> {{ $data['telefono'] ?? 'No proporcionado' }}</p>
<p><strong>Empresa:</strong> {{ $data['empresa'] ?? 'No proporcionada' }}</p>
<p><strong>Mensaje:</strong></p>
<p>{{ $data['mensaje'] }}</p>
