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
 * Controlador perfilController/
 *
 * @author MCHANG mchang@hmetro.med.ec
 *
 */

class perfilController extends Controllers implements IControllers
{

    public function __construct(IRouter $router)
    {
        parent::__construct($router, array(
            'users_logged' => true,
        ));

        global $config;

        // Validador de permisos de rol para controller
        if ($this->user['rol'] > $config['modulos'][$router->getController()]['permisos']) {
            Helper\Functions::redir($config['build']['url']);
        }

        // Para Controladores
        if ($router->getController() == 'perfil' && is_null($router->getMethod()) && is_null($router->getId())) {
            $this->template->display('perfil/roles/' . $this->user['rol'] . '/perfil', array(
                'appBodyClass' => 'page-profile',
                'perfil'       => 'active',
            ));

        }

        // Para metodos
        if (!is_null($router->getMethod()) && is_null($router->getId())) {
            switch ($router->getMethod()) {
                case 'mis-datos':
                    $this->template->display('perfil/roles/' . $this->user['rol'] . '/perfil', array(
                        'appBodyClass' => 'page-profile',
                        'perfil'       => 'active',
                    ));
                    break;
                case 'contraseña':
                    $this->template->display('perfil/roles/' . $this->user['rol'] . '/perfil', array(
                        'appBodyClass' => 'page-profile',
                        'perfil'       => 'active',
                    ));
                    break;
                default:
                    Helper\Functions::redir($config['build']['url'] . 'perfil');
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
                    Helper\Functions::redir($config['build']['url'] . 'perfil');
                    break;
            }

        }

    }
}
