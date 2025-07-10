<?php

namespace App;

class Constants
{

    /**
    * Get the constant key by value
    *
    * @param string $constant the constant item name
    * @param string $value the value
    * @param bool $throw throws if not found, default is false
    * @return string|int the id
    **/
    public static function getKeyByValue(string $constant, string|int $value, bool $throw = false): string|int|null {
        $value = array_flip(constant('self::' . $constant))[$value] ?? null;
        if ($value === null && $throw) {
            throw new \Exception('App constant ' . $constant . ' has invalid value');
        }
        return $value;
    }

    const USER_LEVELS = [
        1    => 'CUSTOMER',
        600  => 'EMPLOYEES',
        700  => 'COMMERCIAL',
        800  => 'FINANCE',
        900  => 'SUPPORT',
        1000 => 'ROOT',
    ];

    public function toArray()
    {
        $reflect = new \ReflectionClass(get_class($this));
        return $reflect->getConstants();
    }

    public static function randomAuthCode(): string
    {
        return str_pad(random_int(1, 999999), 6, '0', STR_PAD_LEFT);
    }
}
