<?php

/*
 * This file is part of the Ocrend Framewok 3 package.
 *
 * (c) Ocrend Software <info@ocrend.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace app\controllers;

use Ocrend\Kernel\Controllers\Controllers;
use Ocrend\Kernel\Controllers\IControllers;
use Ocrend\Kernel\Router\IRouter;

/**
 * Controlador link20to20imagenController/
 *
 * @author MCHANG mchang@hmetro.med.ec
 *
 */

class link20to20imagenController extends Controllers implements IControllers
{

    public function __construct(IRouter $router)
    {
        parent::__construct($router);

        function getUserIP()
        {
            $client  = @$_SERVER['HTTP_CLIENT_IP'];
            $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
            $remote  = $_SERVER['REMOTE_ADDR'];

            if (filter_var($client, FILTER_VALIDATE_IP)) {
                $ip = $client;
            } elseif (filter_var($forward, FILTER_VALIDATE_IP)) {
                $ip = $forward;
            } else {
                $ip = $remote;
            }

            return $ip;
        }

        $user_ip = getUserIP();

        if ($user_ip == '181.39.80.4') {
            header("Location: https://172.16.1.149/zfp");
        } else {
            header("Location: https://imagen.hmetro.med.ec/zfp");
        }

    }
}
