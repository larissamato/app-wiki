<?php

namespace App\Traits;

trait AppSets
{
    /**
     * Item iterator for setMultipleItemsRel
     *
     * @param string $item
     * @param array $params [
     *   Model currentModel,
     *   array items
     *   Model searchModel,
     *   Model targetModel,
     *   string searchField,
     *   string currentIDParam,
     *   string whereErrorIDParam (default 'id')
     *   bool deleteBefore (default true)
     * ]
     * @return void
     **/
    private static function setMultipleItemsRelItem($item, array $params)
    {
        $currentModel      = $params[0];
        $items             = $params[1];
        $searchModel       = $params[2];
        $targetModel       = $params[3];
        $searchField       = $params[4];
        $currentIDParam    = $params[5];
        $targetIDParam     = $params[6];
        $whereErrorIDParam = $params[7] ?? 'id';
        $deleteBefore      = $params[8] ?? true;

        $currentModelClassName = strtolower((new \ReflectionClass($currentModel))->getShortName());
        $searchModelClassName = strtolower((new \ReflectionClass($searchModel))->getShortName());

        $search = $searchModel::withTrashed()->where([$searchField => $item])->first() ??
            abort(422, $currentModelClassName . ' #' . $currentModel->{$whereErrorIDParam}
            . ' was setted but sector attributtion is invalid. Invalid '
            . $searchModelClassName . ': ' . $item);
        $targetModel::create([
            $currentIDParam => $currentModel->id,
            $targetIDParam  => $search->id
        ]);
    }

    /**
     * Set multiple items by relationship
     *
     * @param array $params [
     *   Model currentModel,
     *   array items
     *   Model searchModel,
     *   Model targetModel,
     *   string searchField,
     *   string currentIDParam,
     *   string whereErrorIDParam (default 'id')
     *   bool deleteBefore (default true)
     * ]
     * @return void
     **/
    public static function setMultipleItemsRel(array $params)
    {
        // dont process multiple items if item is explicit null
        if ($params[1] === null) {
            return;
        }

        $currentModel      = $params[0];
        $items             = $params[1];
        $targetModel       = $params[3];
        $currentIDParam    = $params[5];
        $deleteBefore      = $params[8] ?? true;

        if ($deleteBefore) {
            $targetModel::where([$currentIDParam => $currentModel->id])->delete();
        }

        if ($items) {
            foreach ($items as $item) {
                self::setMultipleItemsRelItem($item, $params);
            }
        }
    }
}
