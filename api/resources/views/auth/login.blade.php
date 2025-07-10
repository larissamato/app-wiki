@extends ('layouts.auth')
@section ('pageTitle', __('Login'))

@section ('content')
    <div class="container h-100">
        <div class="col-12 col-md-6 col-lg-5 m-auto card card-glass p-4 bg-white">
            <x-logo></x-logo>
            <form class="form-signin" method="post" action="{{ route('login') }}">
                @csrf
                <div class="col-12">
                    <div class="form-group first py-2">
                        <input type="email" name="email" id="inputEmail" class="form-control @error('email') is-invalid @enderror" placeholder="{{ __('E-mail') }}" required autofocus>
                        @error ('email')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                        @enderror
                    </div>
                    <div class="form-group last">
                        <input type="password" name="password" id="inputPassword" class="form-control @error('email') is-invalid @enderror" placeholder="{{ __('Password') }}" required>
                    <div class="row">
                        <div class="col-12 col-xl-6 text-center text-xl-start my-1">
                            <label for="remember_me">
                                <input id="remember_me" type="checkbox" class="rounded" name="remember">
                                <span class="text-sm text-gray-600">{{ __('Remember me') }}</span>
                            </label>
                        </div>
                        <div class="col-12 col-xl-6 text-center text-xl-end my-1">
                            <a class="text-primary" href="{{ route('password.request') }}">{{ __('Forgot your password?') }}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 text-center mt-3">
                    <button class="btn btn-1 w-100 btn-primary btn-block text-uppercase" type="submit">{{ __('Login') }}</button>
                </div>
            </form>
          </div>
    </div>
@endsection

