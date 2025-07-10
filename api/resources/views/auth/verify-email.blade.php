@extends ('layouts.auth')
@section ('pageTitle', __('Verify E-mail'))

@section ('content')
    <div class="container login-container card glass-card m-auto">
        <div class="row card-body ">
            <div class="col-md-6 m-auto text-center">
                <img class="img-fluid mb-4 d-md-none" src="{{ asset('assets/images/logo-wiki-w.png') }}">
                <lottie-player class="img-fluid m-auto" src="{{ asset('assets/images/auth-lottie-login.json') }}"  background="transparent"  speed="1" loop  autoplay></lottie-player>
            </div>
            <div class="col-md-6 login-form-2">
                <div class="text-center">
                    <img class="img-fluid mb-2 d-none d-md-inline" src="{{ asset('assets/images/logo-wiki-w.png') }}">
                    <h4 class="text-center my-4" style="font-weight:500">{{ __('Verify E-mail') }}</h4>
                    <p>
                        {{ __('Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn\'t receive the email, we will gladly send you another.') }}
                    </p>

                    @if (session('status') == 'verification-link-sent')
                        <div class="alert alert-success my-2 py-2 text-center">
                            {{ __('A new verification link has been sent to the email address you provided during registration.') }}
                        </div>
                    @endif
                </div>
                <form class="form-signin" method="post" action="{{ route('verification.send') }}">
                    @csrf
                    <div class="col-12 text-center mt-3">
                        <button class="btn btn-1 w-100 btn-block text-uppercase" type="submit">{{ __('Resend Verification Email') }}</button>
                    </div>
                    <hr class="my-4">
                    <div class="col-12 text-center">
                        <a class="btn btn-danger text-uppercase mt-2" href="{{ route('logout') }}">{{ __('Log Out') }}</a>
                    </div>
                </form>
          </div>
        </div>
    </div>
@endsection
