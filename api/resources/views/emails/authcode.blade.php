@extends ('emails.layout')

@section ('subject')
    {{ $theSubject }}
@endsection

@section ('content')
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tbody>
        <tr>
          <td width="100%" style="text-align:center;padding-bottom:0px;padding-right:16px;padding-left:16px">
            <div style="font-size:16px;color:#5c5c5c;word-break:break-word;border-radius:8px;text-align:center">
              <p><strong>{{ __('Hi') }} {{ $user->name }},</strong></p>
              <p>{!! nl2br($theMessage) !!}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td width="100%" style="padding-bottom:0px;padding-right:16px">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top" width="100%">
              <tbody>
                <tr>
                  <td align="center" style="font-size:0px;padding:16px 0;word-break:break-word">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%">
                      <tbody>
                        <tr>
                          <td role="presentation" style="border:8px solid #f3f2f6;border-radius:8px;width:310px;background:#f3f2f6;text-align:center" valign="middle">
                            <div style="border:1px solid #e1e1e1;border-radius:8px;padding:10px;background:#fff;text-align:center">
                              <p style="color:#1b0088;font-size:24px;font-weight:700;line-height:76px;margin:0!important;font-family:Trebuchet MS,sans-serif;padding-bottom:5px">{{ $authcode }}</p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td width="100%" style="padding-right:16px;padding-left:16px">
            <div style="font-size:16px;color:#5c5c5c;word-break:break-word;text-align:center">
              <p>{{ __('If you not requested this, please ignore this email') }}</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
@endsection
