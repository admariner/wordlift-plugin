<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit9642ee961b167da95128649b368d802d
{
    public static $prefixLengthsPsr4 = array (
        'W' => 
        array (
            'Wordlift\\Modules\\Common\\' => 24,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Wordlift\\Modules\\Common\\' => 
        array (
            0 => __DIR__ . '/../..' . '/includes',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit9642ee961b167da95128649b368d802d::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit9642ee961b167da95128649b368d802d::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit9642ee961b167da95128649b368d802d::$classMap;

        }, null, ClassLoader::class);
    }
}
