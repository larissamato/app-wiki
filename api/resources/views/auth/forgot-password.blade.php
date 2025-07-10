@extends ('layouts.auth')
@section ('pageTitle', __('Reset Password'))

@section ('content')
    <div class="container h-100">
        <div class="col-12 col-md-6 col-lg-5 m-auto card card-glass p-4 bg-white">
            <div class="col-12">
                <div class="text-center">
                    <h4 class="text-center my-4" style="font-weight:500">{{ __('Reset Password') }}</h4>
                    <p>
                        {{ __('Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.') }}
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
                    @if (session('status'))
                        <div class="alert alert-success">
                            <p class="my-0">{{ session('status') }}</p>
                        </div>
                    @endif
                </div>
            </div>
            <form class="form-signin" method="post" action="{{ route('password.email') }}">
                @csrf
                <div class="form-group py-2">
                    <label for="email">{{ __('E-mail') }}</label>
                    <input id="email" class="form-control @error('email') is-invalid @enderror" type="text" name="email" value="{{ old('email') }}" required autofocus>
                    @error ('email')
                        <div class="invalid-feedback">
                            {{ $message }}
                        </div>
                    @enderror
                </div>
                <div class="col-12 text-center mt-3">
                    <button class="btn btn-1 w-100 btn-block btn-primary text-uppercase" type="submit">{{ __('Email Password Reset Link') }}</button>
                </div>
            </form>
        </div>
    </div>
@endsection
