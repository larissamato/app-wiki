<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>@yield('pageTitle') - {{ config('app.name', 'WIKI APP') }}</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="{{ asset('assets/css/bootstrap5.min.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/css/login.css') }}">
        @yield ('head')
    </head>
    <body style="background-color: #1657aa">
        <main class="container-fluid" style="margin-top: 15vh">
            @yield ('content')
        </div>
        <script src="{{ asset('assets/js/jquery.min.js') }}"></script>
        <script src="{{ asset('assets/js/bootstrap5.bundle.min.js') }}"></script>
        <script>
            function enableSubmit() {
                $('#submitBtn').removeAttr('disabled');
            }
        </script>
        @yield ('foot')
    </body>
</html>
