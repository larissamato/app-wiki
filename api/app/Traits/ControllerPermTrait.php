<?php

namespace App\Traits;

use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

trait ControllerPermTrait
{
    private function userIsSupport(Request $request): bool
    {
        if ($request->user()->level >= 700) {
            return true;
        }
        return false;
    }

    /**
     * Check for onboard/churn permissions
     **/
    protected function checkOnboardPermissions(Request $request, Company|null $company = null): void
    {
        if ($this->userIsCollaborator($request)) {
            abort(403, 'Only customers can use this endpoint');
        }
        $companiesUuids = $request->user()->companies->pluck('uuid')->toArray();
        if ($company && !in_array($company->uuid, $companiesUuids, true)) {
            abort(403, 'Invalid company');
        }
    }

    protected function permDenyROCustomer(Request $request): void
    {
        if (preg_match('/"RO"/i', $request->user()->getRawOriginal('roles'))) {
            abort(403);
        }
    }

    protected function userIsCollaborator(Request $request): bool
    {
        if ($request->user()->level > 1) {
            return true;
        }
        return false;
    }

    protected function userIsEqualsOrGreaterThan(Request $request, int $level): bool
    {
        return $request->user()->level >= $level;
    }

    protected function permCollection(Request $request, Model|Builder $model, string $key = 'company_id'): Model|Builder
    {
        if ($this->userIsSupport($request, $model)) {
            return $model;
        }
        return $model->whereIn($key, $request->user()->companies->pluck('id'));
    }

    protected function permCollectionEntity(Request $request, Model|Builder $model): Model|Builder
    {
        if ($this->userIsSupport($request, $model)) {
            return $model;
        }
        return $model->where('entity_id', $request->user()->entity_id);
    }

    protected function perm(Request $request, Model $model, string $key = 'company_id'): void
    {
        if ($request->user()->level === 1 && (
            empty($request->user()->companies)
            || !in_array($model->{$key}, $request->user()->companies->pluck('id')->toArray(), true)
        )) {
            abort(404);
        }
    }

    protected function permIsEqualOrGreaterThan(Request $request, int $level): void
    {
        $this->userIsEqualsOrGreaterThan($request, $level) ?: abort(403);
    }

    protected function permEntity(Request $request, Model $model): void
    {
        if ($request->user()->level === 1 && $request->user()->entity_id !== $model->entity_id) {
            abort(404);
        }
    }

    protected function permIsPrivate(Request $request, Model $model): void
    {
        if ($request->user()->level === 1 && $model->is_private) {
            abort(404);
        }
    }

    protected function permOnlySupport(Request $request): void
    {
        if ($request->user()->level == 1) {
            abort(401, 'You cannot access this feature');
        }
    }

    protected function permThroughDeviceId(
        Request $request,
        string $modelTableName,
        Model|Builder $model
    ): Model|Builder {
        $model = $model
            ->select(($modelTableName . '.*'))
            ->join('devices', 'devices.id', '=', ($modelTableName . '.device_id'));
        $model = $this->permCollection($request, $model);
        return $model;
    }

    protected function permCompanyRequest(Request $request): void
    {
        if ($request->user()->level === 1 && !in_array(
            $request->company,
            $request->user()->companies()->pluck('uuid')->toArray(),
            true
        )) {
            abort(403);
        }
    }
}
