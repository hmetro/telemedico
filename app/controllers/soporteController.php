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
 * Controlador soporteController/
 *
 * @author MCHANG mchang@hmetro.med.ec
 *
 */

class soporteController extends Controllers implements IControllers
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
        if ($router->getController() == 'soporte' && is_null($router->getMethod()) && is_null($router->getId())) {
            $this->template->display('soporte/roles/' . $this->user['rol'] . '/tickets', array(
                'appBodyClass' => 'page-profile',
                'perfil'       => 'active',
            ));

        }

        // Para metodos
        if (!is_null($router->getMethod()) && is_null($router->getId())) {
            switch ($router->getMethod()) {
                case 'mis-tickets':
                    $this->template->display('soporte/roles/' . $this->user['rol'] . '/tickets', array(
                        'appBodyClass' => 'page-profile',
                        'soporte'      => 'active',
                    ));
                    break;
                case 'comentarios-y-sugerencias':
                    $this->template->display('soporte/roles/' . $this->user['rol'] . '/tickets', array(
                        'appBodyClass' => 'page-profile',
                        'soporte'      => 'active',
                    ));
                    break;
                default:
                    Helper\Functions::redir($config['build']['url'] . 'soporte');
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
                    Helper\Functions::redir($config['build']['url'] . 'soporte');
                    break;
            }

        }

    }
}
