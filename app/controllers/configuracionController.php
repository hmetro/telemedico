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
use Ocrend\Kernel\Helpers as Helper;
use Ocrend\Kernel\Router\IRouter;

/**
 * Controlador configuracionController/
 *
 * @author MCHANG mchang@hmetro.med.ec
 *
 */

class configuracionController extends Controllers implements IControllers
{

    public function __construct(IRouter $router)
    {
        parent::__construct($router, array(
            'users_logged' => true,
        ));

        global $config;

        // Para Controladores
        if ($router->getController() == 'configuracion' && is_null($router->getMethod()) && is_null($router->getId())) {
            $this->template->display('configuracion/roles/' . $this->user['rol'] . '/configuracion', array(
                'appBodyClass'  => 'page-profile',
                'configuracion' => 'active',
            ));

        }

        // Para metodos
        if (!is_null($router->getMethod()) && is_null($router->getId())) {
            switch ($router->getMethod()) {
                case 'calendario':
                    $this->template->display('calendario/roles/' . $this->user['rol'] . '/calendario', array(
                        'appBodyClass' => 'app-calendar',
                        'teleconsulta' => 'active',
                        'calendario'   => '#0168fa',
                    ));
                    break;
                case 'pacientes':
                    $this->template->display('pacientes/roles/' . $this->user['rol'] . '/pacientes', array(
                        'appBodyClass' => 'app-contact',
                        'teleconsulta' => 'active',
                        'pacientes'    => '#0168fa',
                    ));
                    break;
                default:
                    Helper\Functions::redir($config['build']['url'] . 'configuracion');
                    break;
            }

        }

        // Para metodos y ids
        if (!is_null($router->getMethod()) && !is_null($router->getId())) {
            switch ($router->getId()) {
                case 'zoom':
                    echo "zoom";
                    break;
                default:
                    Helper\Functions::redir($config['build']['url'] . 'configuracion');
                    break;
            }

        }

    }
}
