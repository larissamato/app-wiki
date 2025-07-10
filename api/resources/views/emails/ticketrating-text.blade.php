{{ $subject }}

{{ __($user->name) }}, {{ __('ticket.review ticket desc') }}
<br>
{{ __('ticket.please rate the ticket #') }} {{ $ticket->id }}

@if (!empty($link) && isset($link['link']))
{{ __('ticket.rate the ticket #') }} {{ $ticket->id }}: https://app.wiki.example/{{ $link['link'] }}
@endif
