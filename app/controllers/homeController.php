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
 * Controlador home/
 *
 * @author Ocrend Software C.A <bnarvaez@ocrend.com>
 */
class homeController extends Controllers implements IControllers
{

    public function __construct(IRouter $router)
    {
        parent::__construct($router);

        global $config;

        # Cluster login
        if (count($this->user) == 0) {

            $this->name_template = 'login/login';

            if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                Helper\Functions::redir($config['build']['url']);
            }

            $this->template->display($this->name_template, array(
                'appBodyClass' => '',
            ));

        } else {

            Helper\Functions::redir($config['build']['url'] . 'teleconsulta/pacientes');

            // Validador de permisos de rol para controller
            if ($this->user['rol'] > $config['modulos'][$router->getController()]['permisos']) {
                Helper\Functions::redir($config['build']['url']);
            }

            $this->name_template = 'dashboard/roles/' . $this->user['rol'] . '/dashboard';

            if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                Helper\Functions::redir($config['build']['url']);
            }

            $this->template->display($this->name_template, array(
                'appBodyClass' => 'page-profile',
                'dashboard'    => 'active',
            ));
        }

    }
}
