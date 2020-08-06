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
 * Controlador liveController/
 *
 * @author MCHANG mchang@hmetro.med.ec
 *
 */

class liveController extends Controllers implements IControllers
{

    public function __construct(IRouter $router)
    {
        parent::__construct($router);

        global $config;

        $this->name_template = 'pacientes/live-public';

        if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
            Helper\Functions::redir($config['build']['url']);
        }

        $this->template->display($this->name_template);
    }
}
