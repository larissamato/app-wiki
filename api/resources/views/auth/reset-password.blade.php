@extends ('layouts.auth')
@section ('pageTitle', __('Reset Password'))

@section ('content')
    <div class="container h-100">
        <div class="col-12 col-md-6 col-lg-5 m-auto card card-glass p-4 bg-white">
            <x-logo></x-logo>
            <h4 class="text-center my-4" style="font-weight:500">{{ __('Reset Password') }}</h4>
            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <form class="form-signin" method="post" action="{{ route('password.update') }}">
                @csrf
                <input type="hidden" name="token" value="{{ $request->route('token') }}">
                <div class="form-group py-2">
                    <label for="email">{{ __('E-mail') }}</label>
                    <input id="email" class="form-control @error('email') is-invalid @enderror" type="text" name="email" value="{{ old('email') }}" required autofocus>
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
                    <label for="password_confirmation">{{ __('Confirm password') }}</label>
                    <input id="password_confirmation" class="form-control @error('password_confirmation') is-invalid @enderror" type="password" name="password_confirmation">
                    @error ('password_confirmation')
                        <div class="invalid-feedback">
                            {{ $message }}
                        </div>
                    @enderror
                </div>
                <div class="col-12 text-center mt-3">
                    <button class="btn btn-1 w-100 btn-block btn-primary text-uppercase" type="submit">{{ __('Reset Password') }}</button>
                </div>
            </form>
        </div>
    </div>
@endsection
