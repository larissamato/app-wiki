@extends ('emails.layout')

@section ('subject')
    {{ $subject }}
@endsection

@section ('content')
    @if ($lastFollowup = $ticket->followups->last())
        @if (!$lastFollowup->is_private)
            <p>{{ __('ticket.latest followup') }}:</p>
            <p>{{ $lastFollowup->followup }}</p>
        @endif
    @endif
@endsection
