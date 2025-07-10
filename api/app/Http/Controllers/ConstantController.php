<?php

namespace App\Http\Controllers;

use App\Constants;

class ConstantController extends Controller
{
    public function index()
    {
        $constant = new Constants();
        return $constant->toArray();
    }
}
