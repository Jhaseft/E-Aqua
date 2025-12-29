<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" translate="no">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Título dinámico -->
    <title inertia>{{ config('app.name', 'Aqua Health') }}</title>

    <!-- Favicon -->
    <link rel="icon" href="https://res.cloudinary.com/dnbklbswg/image/upload/v1760231510/Logo_d0isxo.png" type="image/png">

    <!-- Fuente principal -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">

    <!-- Meta Open Graph para redes sociales -->
    <meta property="og:title" content="Aqua Health" />
    <meta property="og:description" content="Servicios profesionales de saneamiento de aguas" />
    <meta property="og:image" content="https://res.cloudinary.com/dnbklbswg/image/upload/v1760231510/Logo_d0isxo.png" />
    <meta property="og:url" content="{{ url('/') }}" />
    <meta property="og:type" content="website" />

    <!-- Meta para Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Aqua Health" />
    <meta name="twitter:description" content="Servicios profesionales de saneamiento de aguas" />
    <meta name="twitter:image" content="https://res.cloudinary.com/dnbklbswg/image/upload/v1760231510/Logo_d0isxo.png" />

    <!-- Fuentes -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts Laravel + Inertia + React -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
