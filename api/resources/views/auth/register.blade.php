@extends ('layouts.auth')
@section ('pageTitle', __('Create Account'))

@section ('content')
    <div class="container h-100">
        <div class="col-12 col-md-6 col-lg-5 m-auto card card-glass p-4 bg-white">
            <x-logo></x-logo>
            <form class="form-signin" method="post" action="{{ route('register') }}">
                @csrf
                <div class="col-12">
                    <div class="form-group first py-2">
                        <label for="name">{{ __('Name') }}</label>
                        <input id="name" class="form-control @error('name') is-invalid @enderror" type="text" name="name" value="{{ old('name') }}" required>
                        @error ('name')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                        @enderror
                    </div>
                    <div class="form-group py-2">
                        <label for="email">{{ __('E-mail') }}</label>
                        <input id="email" class="form-control @error('email') is-invalid @enderror" type="text" name="email" value="{{ old('email') }}" required>
                        @error ('email')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                        @enderror
                    </div>
                    <div class="form-group py-2">
                        <label for="password">{{ __('Password') }}</label>
                        <input id="password" class="form-control @error('password') is-invalid @enderror" type="password" name="password" required autocomplete="new-password">
                        @error ('password')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                        @enderror
                        <label for="password_confirmation">{{ __('Confirm Password') }}</label>
                        <input id="password_confirmation" class="form-control @error('password_confirmation') is-invalid @enderror" type="password" name="password_confirmation">
                        @error ('password_confirmation')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                        @enderror
                    </div>
                </div>
                <div class="col-12 mt-1">
                    <a class="text-primary" href="{{ route('login') }}">{{ __('Already registered?') }}</a>
                </div>
                <div class="col-12 text-center mt-3">
                    <button class="btn btn-1 w-100 btn-block btn-primary text-uppercase" type="submit">{{ __('Register') }}</button>
                </div>
            </form>
        </div>
    </div>
@endsection
