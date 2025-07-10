@extends ('layouts.auth')
@section ('pageTitle', __('Confirm password'))

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
                    <h4 class="text-center my-4" style="font-weight:500">{{ __('Confirm password') }}</h4>
                    <p>
                        {{ __('This is a secure area of the application. Please confirm your password before continuing.') }}
                    </p>
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif
                </div>
                <form class="form-signin" method="post" action="{{ route('password.confirm') }}">
                    @csrf
                    <div class="form-group py-2">
                        <label for="password">{{ __('Password') }}</label>
                        <input id="password" class="form-control @error('password') is-invalid @enderror" type="password" name="password" required autocomplete="new-password">
                        @error ('password')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                        @enderror
                        <label for="password_confirmation">{{ __('Confirm password') }}</label>
                        <input id="password_confirmation" class="form-control @error('password_confirmation') is-invalid @enderror" type="password" name="password_confirmation">
                        @error ('password_confirmation')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                        @enderror
                    </div>
                    <div class="col-12 text-center mt-3">
                        <button class="btn btn-1 w-100 btn-block text-uppercase" type="submit">{{ __('Confirm') }}</button>
                    </div>
                </form>
          </div>
        </div>
    </div>
@endsection
