@extends ('emails.layout')

@section ('subject')
    {{ $subject }}
@endsection

@section ('content')
    {!! $content !!}
@endsection
