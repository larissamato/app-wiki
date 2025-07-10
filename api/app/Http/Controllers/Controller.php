<?php

namespace App\Http\Controllers;

use App\Constants;
use App\Services\Utils;
use App\Traits\ControllerPermTrait;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Controller extends BaseController
{
    use ControllerPermTrait, AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function search($request, $model, $fields)
    {
        $qArr = array_filter(explode(' ', trim($request->get('search'))));
        foreach ($qArr as $q) {
            $q = '%'. $q . '%';
            $model = $model->where(function ($query) use ($fields, $q) {
                foreach ($fields as $k => $field) {
                    if ($k === 0) {
                        $query = $query->where($field, 'like', $q);
                        continue;
                    }
                    $query = $query->orWhere($field, 'like', $q);
                }
            });
        }
        return $model;
    }

    private function searchOnlyUuidsLoopItem(int $k, string $uuid, Builder|Model $model): Builder|Model
    {
        if ($k === 0) {
            $model = $model->where('uuid', $uuid);
        }
        $model = $model->orWhere('uuid', $uuid);
        return $model;
    }

    private function searchOnlyUuidsLoop(array $uuids, Builder|Model $model): array
    {
        $searchOnlyUuids = false;
        foreach ($uuids as $k => $uuid) {
            if (Str::isUuid($uuid)) {
                $searchOnlyUuids = true;
                $model = $this->searchOnlyUuidsLoopItem($k, $uuid, $model);
            }
        }
        return ['model' => $model, 'searchOnlyUuids' => $searchOnlyUuids];
    }

    protected function searchOnlyUuids(Request $request, Builder|Model $model): Builder|Model|bool
    {
        $searchOnlyUuids = false;
        if ($request->get('search')) {
            $uuids = explode(',', $request->get('search'));
            $res = $this->searchOnlyUuidsLoop($uuids, $model);
            $model = $res['model'];
            $searchOnlyUuids = $res['searchOnlyUuids'];
        }
        if ($searchOnlyUuids) {
            return $model;
        }
        return false;
    }

    protected function whereFilters($request, $model, $filters)
    {
        $filtersKeys = array_keys($filters);
        if ($request->hasAny($filtersKeys)) {
            foreach ($filters as $filterKey => $filterConst) {
                if ($request->has($filterKey)) {
                    $query = explode(',', $request->get($filterKey));
                    $filterConstFlip = array_flip($filterConst);
                    $queryChecked = [];
                    foreach ($query as $q) {
                        if (!$q) {
                            continue;
                        }
                        if (!in_array($q, $filterConst, true)) {
                            abort(422, 'Invalid query');
                        }
                        $queryChecked[] = $filterConstFlip[$q];
                    }
                    if ($queryChecked) {
                        $model = $model->whereIn($filterKey, $queryChecked);
                    }
                }
            }
        }
        return $model;
    }

    /**
     * Filter by table column
     *
     * @param Request $request the request
     * @param Model $model the current model
     * @param string $field the field name
     * @param array $params [
     *  'table'    => 'table_name', // the table name
     *  'multiple' =>  false, // if request is an list with item1,item2...if yes this should marked as true
     *  'column'   => 'table_name.uuid', // the column of the field
     *  'orWhere'  => false, // if main where need to be "orWhere"
     *  'whereType' => null, // if use another type of where, example: whereNot
     *  'join' => [ // if where needs join (Optional)
     *      'table' => 'another_table', // the join table
     *      'field' => 'another_table.item_id', // the join field
     *      'comp' => '=', // what is the join sign (= or > or < for example)
     *      'target' => 'parent_table.id', // the target id
     *  ],
     * ]
     *
     * @return Ticket $ticket the ticket model with wheres applied
     **/
    protected function whereTableColumn($request, $model, $field, $params)
    {
        if (!$request->get($field)) {
            return $model;
        }
        $query = [$request->get($field)];
        if (isset($params['multiple']) && $params['multiple']) {
            $query = explode(',', $request->get($field));
        }
        $whereType = 'where';
        if (!empty($params['orWhere'])) {
            $whereType = 'orWhere';
        }
        if (!empty($params['whereType'])) {
            $whereType = $params['whereType'];
        }

        $model = $model->{$whereType}(function ($tkQuery) use ($query, $params) {
            foreach ($query as $q) {
                $tkQuery = $tkQuery
                    ->orWhereHas($params['table'], function (Builder $dbQuery) use ($q, $params) {
                        if (!empty($params['join'])) {
                            $dbQuery = $dbQuery->join(
                                $params['join']['table'],
                                $params['join']['field'],
                                $params['join']['comp'],
                                $params['join']['target']
                            );
                        }
                        $dbQuery = $dbQuery->where($params['column'], '=', $q);
                    });
            }
        });
        return $model;
    }

    /**
     * Where Created By uuid
     *
     * Makes a join for user created_by by user uuid and return model
     * with join of the user
     *
     * @param string $uuid the user uuid
     * @param Model|Builder $model the model
     * @param string $tableName the table name where the join will be attached
     *               IMPORTANT: do not use this parameter as dynamic input from user
     *
     * @return Model|Builder|null the model with user joined
     **/
    protected function whereCreatedByUuid(string $uuid, Model|Builder $model, string $tableName): Model|Builder|null
    {
        return $model->join('users', 'users.id', '=', $tableName . '.created_by')
            ->where(['users.uuid' => $uuid])
            ->first();
    }

    /**
     * With Trashed Filter
     *
     * Filter that shows deleted/trashed items when request param "trashed" is true
     *
     * @param Request $request the request
     * @param Model|Builder $model the model,
     * @param bool $permCollb Check by Controller->userIsCollaborator (default true)
     *
     * @return Model|Builder the model with or without Model::withTrashed()
     **/
    protected function withTrashedFilter(Request $request, Model|Builder $model, bool $permCollb = true): Model|Builder
    {
        if ($request->get('trashed') != 'true') {
            return $model;
        }
        if ($permCollb && !$this->userIsCollaborator($request)) {
            return $model;
        }
        return $model->withTrashed();
    }


    /**
     * Get Optional parameter by Key
     *
     * @param string $search
     * @param string $class of the searchable model
     * @param object|null $value of the object that contains the keys
     * @param string|null $key
     *
     * @return Ticket $ticket the ticket model with wheres applied
     **/
    protected function getOptionalByKey(
        string $search,
        string $class,
        object|null $value,
        $key = 'id'
    ): null|string {
        return Utils::getOptionalByKey($search, $class, $value, $key);
    }

    /**
    * Where by Constant key
    *
    * @param string $constant the constant, example: MARKETPLACE_PRODUCT_TYPES
    * @param string $key the database key, example: type,
    * @param string|null $value the value, example: CPU (if null, the model will returned without where)
    * @param Model|Builder $model the model
    *
    * @return Model|Builder the model
    **/
    protected function whereConstant(
        string $constant,
        string $key,
        string|null $value,
        Model|Builder $model
    ): Model|Builder {
        if (!$value) {
            return $model;
        }
        return $model->where($key, Constants::getKeyByValue($constant, $value));
    }
}
