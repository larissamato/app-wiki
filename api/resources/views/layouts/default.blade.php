<!DOCTYPE html>
<html>
<head>
    <style>
        @font-face {
            font-family: 'Open Sans';
            font-style: normal;
            font-weight: normal;
            src: url(http://themes.googleusercontent.com/static/fonts/opensans/v8/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf) format('truetype');
        }

        html, body {
            height: 100%;
            margin: 0;
        }

        .header {
            margin: 0px;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 3cm;
            text-align: center;
        }

        .footer {
            margin: 0px;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3cm;
            text-align: center;
        }

        body {
            display: flex;
            flex-direction: column;
        }

        main {
            margin-top: 3cm;
            margin-left: 0.5cm;
            margin-right: 0.5cm;
            margin-bottom: 2cm;
            font-family: 'Open Sans', Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif;
            height: 100vh;
        }

        p, td, th, li {
            font-size: 12px;
        }

        .text-center {
            width: 100%;
            text-align: center;
        }

        h4, h5 {
            margin: 15px 0px;
        }

        .col-12 {
            width: 100%;
        }

        .col-6 {
            width: 50%;
        }

        table {
            border-collapse: collapse;
            border-spacing: 4px 2px;
        }

        tr.border_bottom td {
          border-bottom: 1px solid black;
        }

        .no-border-top, .no-border-top td {
            border-top: none;
        }

        .m-0 {
            margin: 0px;
        }

        .mt-0 {
            margin-top: 0px;
        }

        .mt-1 {
            margin-top: 2px;
        }

        .mt-2 {
            margin-top: 4px;
        }

        .mt-4 {
            margin-top: 20px;
        }

        .mt-5 {
            margin-top: 50px;
        }

        .mb-0 {
            margin-bottom: 0px;
        }

        .mb-1 {
            margin-bottom: 2px;
        }

        .mb-2 {
            margin-bottom: 4px;
        }

        .mb-4 {
            margin-bottom: 6px;
        }

        .pl-1 {
            padding-left: 4px;
        }

        .pl-2 {
            padding-left: 8px;
        }

        .pl-3 {
            padding-left: 12px;
        }

        .pl-4 {
            padding-left: 16px;
        }

        .pl-5 {
            padding-left: 20px;
        }

        .pl-6 {
            padding-left: 24px;
        }

        .pl-7 {
            padding-left: 28px;
        }

        .pl-8 {
            padding-left: 32px;
        }

        .pl-12 {
            padding-left: 64px;
        }

        .contract {
            margin: 0px 45px;
        }

        .contract p {
            margin: 10px 0px;
        }

        .contract-subject {
            font-weight: bold;
        }

        .contract-sign {
            border-top: 1px solid #000;
            width: 400px;
        }
    </style>
</head>
<body>
    <main>
        @yield('main')
    </main>
</body>
</html>
