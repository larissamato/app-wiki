<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AppFormRequest extends FormRequest
{
    private function rulesFilterPutItem($updateRules, $input)
    {
        if (isset($this->getRules()[$input])) {
            $updateRules[$input] = $this->getRules()[$input];
        }

        return $updateRules;
    }

    protected function getRules()
    {
        return [];
    }

    protected function rulesFilterPut()
    {
        if (in_array($this->method(), ['PUT', 'PATCH'])) {
            $updateRules = [];
            foreach (array_keys($this->all()) as $input) {
                $updateRules = $this->rulesFilterPutItem($updateRules, $input);
            }

            return $updateRules;
        }

        return $this->getRules();
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return $this->rulesFilterPut();
    }
}
