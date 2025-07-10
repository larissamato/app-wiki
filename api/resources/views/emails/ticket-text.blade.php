{{ $subject }}

@if ($lastFollowup = $ticket->followups->last())
@if (!$lastFollowup->is_private)
{{ ucfirst(__('ticket.latest followup')) }}:
{{ $lastFollowup->followup }}
@endif
@endif

@if (!empty($link) && isset($link['link']))
{{ __('ticket.view ticket') }}: https://app.wiki.example/ticket/{{ $link['link'] }}
@endif
