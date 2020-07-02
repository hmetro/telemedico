<?php

/*
 * This file is part of the Ocrend Framewok 3 package.
 *
 * (c) Ocrend Software <info@ocrend.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace app\models;

use app\models as Model;
use Firebase\JWT\JWT;
use Ocrend\Kernel\Models\IModels;
use Ocrend\Kernel\Models\Models;
use Ocrend\Kernel\Router\IRouter;

/**
 * Modelo Auth
 */
class Auth extends Models implements IModels
{

    public function generateKey()
    {

        global $config;

        $time = time();

        $key    = $config['zoom']['api_key'];
        $secret = $config['zoom']['api_secret'];

        $token = array(
            'alg' => 'HS256',
            'typ' => 'JWT',
            'iss' => $key,
            'exp' => strtotime('+1 minute', $time),
        );

        # SETEAR VALORES DE RESPUESTA
        return array(
            'status'     => true,
            'zoom_token' => JWT::encode($token, $config['zoom']['api_secret']),
        );
    }

/**
 * __construct()
 */

    public function __construct(IRouter $router = null)
    {
        parent::__construct($router);
    }
}
