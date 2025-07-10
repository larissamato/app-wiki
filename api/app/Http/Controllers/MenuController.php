<?php

namespace App\Http\Controllers;

use App\Services\Utils;
use Illuminate\Http\Request;
use App\Models\Device;

/**
 * Menu controller to get current user dynamic menu
 **/
class MenuController extends Controller
{
    protected $request;
    /**
     * Get the menu resource from resource static path
     * @return object menu object with data and meta
     **/
    protected function getMenuResource()
    {
        return json_decode(file_get_contents(resource_path('static/menu.json')));
    }

    /**
     * Check item require by query
     *
     * For example, if user has devices, he can access the menu with "devices" require
     *
     * @param string $param param of the require (user level or *)
     * @param object $req require object
     * @return bool
     **/
    protected function checkMenuItemRequireByQuery($param, $req): bool
    {
        if (!isset($req->{$param})) {
            return false;
        }

        $return = false;
        switch ($req->{$param}) {
            case 'devices':
                $return = Device::whereIn(
                    'company_id',
                    $this->request->user()->companies->pluck('id')
                )->count() > 0 ? true : false;
                break;
            case 'quotes':
                $return = $this->request->user()->level >= 700 && $this->request->user()->level < 900 ? true : false;
                break;
            case 'receipt':
                $return = Utils::isUserPods($this->request->user());
                break;
            // TODO billing
        }

        return $return;
    }

    /**
     * Check user roles item, this is called from checkMenuItemRequireIterator
     *
     * @param string $role the role
     * @param object $req the role
     * @param string $param the param
     * @return bool
     **/
    protected function checkMenuItemRequireIteratorItem($role, $req, $param)
    {
        if (!isset($req->{$param})) {
            return false;
        }

        if ($role == $req->{$param}) {
            return true;
        }

        return false;
    }

    /**
     * Check if user roles matches with require, this is called from checkMenuItemRequireParams
     *
     * @param array $userRoles array of user roles
     * @param string $param param of the require (user level or *)
     * @param object $req require object
     * @return bool
     **/
    protected function checkMenuItemRequireIterator($userRoles, $param, $req)
    {
        if ($this->checkMenuItemRequireByQuery($param, $req)) {
            return true;
        }

        if (empty($userRoles)) {
            return false;
        }

        foreach ($userRoles as $role) {
            if ($this->checkMenuItemRequireIteratorItem($role, $req, $param)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check each require params (user level or *)
     *
     * @param array $userRoles array of user roles
     * @param string $param param of the require (user level or *)
     * @param object $require require object
     * @return bool
     **/
    protected function checkMenuItemRequireParams($userRoles, $param, $require)
    {
        foreach ($require as $req) {
            if ($this->checkMenuItemRequireIterator($userRoles, $param, $req)) {
                return true;
            }
        }

        return false;
    }

    protected function checkMenuItemRequireXXAllow($userLevel, $require)
    {
        $requireParams = [];
        foreach ($require as $r) {
            $key = array_keys((array) $r)[0];
            if (preg_match('/(\d)XX$/', $key, $m)) {
                if ((int) ($userLevel / 100) >= $m[1] && $r->{$key} === '*allow*') {
                    return true;
                }
                if ((int) ($userLevel / 100) >= $m[1]) {
                    $requireParams[] = $key;
                    break;
                }
            }
        }
        return $requireParams;
    }

    /**
     * Check menu item requires, if user level is 1000 the check is dismissed
     *
     * This method will call checkMenuItemRequireParams for user level and * (all users)
     *
     * @param int $userLevel the user level
     * @param array $userRoles array of user roles
     * @param object $require require object
     * @return bool
     **/
    protected function checkMenuItemRequire($userLevel, $userRoles, $require)
    {
        $requireParams = [
            $userLevel, '*'
        ];

        $requireXX = $this->checkMenuItemRequireXXAllow($userLevel, $require);
        if ($requireXX === true) {
            return true;
        }

        $requireParams = array_merge($requireXX, $requireParams);
        foreach ($requireParams as $param) {
            if ($this->checkMenuItemRequireParams($userRoles, $param, $require)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check permission level
     *
     * @param int $userLevel the user level
     * @param object $m the menu item
     * @return bool
     **/
    protected function checkMenuItemPermLevel($userLevel, $userIsBeta, $m)
    {
        if ($userIsBeta && isset($m->perm->beta) && $m->perm->beta) {
            return true;
        }
        if ($userLevel < $m->perm->level->min || $userLevel > $m->perm->level->max) {
            return false;
        }
        return true;
    }

    /**
     * Check each menu item for permission and "requires"
     *
     * @param Request $request the request
     * @param object $m the menu item
     * @return false|object false if user doesnt has permission or object if user has permission
     **/
    protected function checkMenuItem($request, $m)
    {
        $userLevel = $request->user()->level;

        if ($userLevel === 1000) {
            return $m;
        }

        $userRoles = $request->user()->makeVisible(['roles'])->roles ?? [];
        $userIsBeta = false;
        if ($request->user()->entity) {
            $userIsBeta = preg_match('/beta=1/', $request->user()->entity->obs);
        }

        if (!$this->checkMenuItemPermLevel($userLevel, $userIsBeta, $m)) {
            return false;
        }

        if (!empty($m->perm->require)) {
            if (!$this->checkMenuItemRequire($userLevel, $userRoles, $m->perm->require)) {
                return false;
            }
        }

        return $m;
    }

    protected function renderItem(object $m): array
    {
        return [
            'name' => __('menu.' . $m->name),
            'link' => $m->link,
            'icon' => $m->icon
        ];
    }

    protected function childrenItems(Request $request, bool|object $m): array
    {
        $children = [];
        if (empty($m->children)) {
            return $children;
        }
        foreach ($m->children as $c) {
            if ($c = $this->checkMenuItem($request, $c)) {
                $children[] = $this->renderItem($c);
            }
        }
        return $children;
    }

    /**
     * Main controller to get the current user menu
     *
     * @param Request $request
     * @return Response the menu inside data and meta
     **/
    public function index(Request $request)
    {
        $this->request = $request;
        $allowedMenu = [];
        $menu = $this->getMenuResource();
        foreach ($menu->data as $m) {
            if ($m = $this->checkMenuItem($request, $m)) {
                $renderedMenu = $this->renderItem($m);
                $renderedMenu['children'] = $this->childrenItems($request, $m);
                $allowedMenu[] = $renderedMenu;
            }
        }

        return [
            'data' => $allowedMenu,
            'meta' => $menu->meta
        ];
    }
}
