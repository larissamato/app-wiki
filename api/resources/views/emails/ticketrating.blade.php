@extends ('emails.layout')

@section ('subject')
    {{ $subject }}
@endsection

@section ('content')
    <p>{{ __($user->name) }}, {{ __('ticket.review ticket desc') }}</p>
    <br><br>
    <p>{{ __('ticket.please rate the ticket #') }} {{ $ticket->id }}</p>
@endsection
