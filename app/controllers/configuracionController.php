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

        global $http, $config;

        // Validador de permisos de rol para controller
        if ($this->user['rol'] > $config['modulos'][$router->getController()]['permisos']) {
            Helper\Functions::redir($config['build']['url']);
        }

        // Para Controladores
        if ($router->getController() == 'configuracion' && is_null($router->getMethod()) && is_null($router->getId())) {

            $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/configuracion';

            if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                Helper\Functions::redir($config['build']['url']);
            }

            $this->template->display($this->name_template, array(
                'appBodyClass'  => 'page-profile',
                'configuracion' => 'active',
            ));

        }

        // Para metodos
        if (!is_null($router->getMethod()) && is_null($router->getId())) {

            switch ($router->getMethod()) {

                case 'categorias-pacientes':

                    $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/pacientes';

                    if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                        Helper\Functions::redir($config['build']['url']);
                    }

                    $this->template->display($this->name_template, array(
                        'appBodyClass'  => 'page-profile',
                        'configuracion' => 'active',
                    ));

                    break;

                case 'horarios':

                    # Configuración de Citas para rol de Administrador, Medico, y Gestionador

                    $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/horarios';

                    if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                        Helper\Functions::redir($config['build']['url']);
                    }

                    $this->template->display($this->name_template, array(
                        'appBodyClass'  => 'page-profile',
                        'configuracion' => 'active',
                    ));

                    break;

                case 'usuarios':

                    $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/usuarios';

                    if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                        Helper\Functions::redir($config['build']['url']);
                    }

                    $this->template->display($this->name_template, array(
                        'appBodyClass'  => 'page-profile',
                        'configuracion' => 'active',
                    ));

                    break;

                case 'facturacion':

                    $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/pagos';

                    if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                        Helper\Functions::redir($config['build']['url']);
                    }

                    $this->template->display($this->name_template, array(
                        'appBodyClass'  => 'page-profile',
                        'configuracion' => 'active',
                    ));
                    break;

                default:
                    Helper\Functions::redir($config['build']['url'] . 'configuracion');
                    break;
            }

        }

        // Para metodos y ids
        if (!is_null($router->getMethod()) && !is_null($router->getId())) {

            // Seteo de rutas
            if ($router->getMethod() == 'horarios' && !is_null($router->getId()) && $router->getId() == 'nuevo') {

                # Configuración de Citas para rol de Administrador, Medico, y Gestionador
                $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/nuevo-horario';

                if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                    Helper\Functions::redir($config['build']['url']);
                }

                $this->template->display($this->name_template, array(
                    'appBodyClass'  => 'page-profile',
                    'configuracion' => 'active',
                ));

            } elseif ($router->getMethod() == 'horarios' && !is_null($router->getId()) && $router->getId() == 'editar') {

                # Configuración de Citas para rol de Administrador, Medico, y Gestionador
                $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/editar-horario';

                if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                    Helper\Functions::redir($config['build']['url']);
                }

                $this->template->display($this->name_template, array(
                    'appBodyClass'  => 'page-profile',
                    'configuracion' => 'active',
                ));

            } elseif ($router->getMethod() == 'horarios' && !is_null($router->getId()) && $router->getId() == 'eliminar') {

                # Configuración de Citas para rol de Administrador, Medico, y Gestionador
                $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/eliminar-horario';

                if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                    Helper\Functions::redir($config['build']['url']);
                }

                $this->template->display($this->name_template, array(
                    'appBodyClass'  => 'page-profile',
                    'configuracion' => 'active',
                ));

            } elseif ($router->getMethod() == 'categorias-pacientes' && !is_null($router->getId()) && $router->getId() == 'nueva') {

                # Agregar una nueva categoria de pacientes
                $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/nueva-categoria';

                if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                    Helper\Functions::redir($config['build']['url']);
                }

                $this->template->display($this->name_template, array(
                    'appBodyClass'  => 'page-profile',
                    'configuracion' => 'active',
                ));

            } elseif ($router->getMethod() == 'categorias-pacientes' && !is_null($router->getId()) && $router->getId() == 'editar') {

                # Agregar una nueva categoria de pacientes
                $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/editar-categoria';

                if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                    Helper\Functions::redir($config['build']['url']);
                }

                $this->template->display($this->name_template, array(
                    'appBodyClass'  => 'page-profile',
                    'configuracion' => 'active',
                ));

            } elseif ($router->getMethod() == 'categorias-pacientes' && !is_null($router->getId()) && $router->getId() == 'eliminar') {

                # Agregar una nueva categoria de pacientes
                $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/eliminar-categoria';

                if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                    Helper\Functions::redir($config['build']['url']);
                }

                $this->template->display($this->name_template, array(
                    'appBodyClass'  => 'page-profile',
                    'configuracion' => 'active',
                ));

            } elseif ($router->getMethod() == 'usuarios' && !is_null($router->getId()) && $router->getId() == 'nuevo') {

                # Agregar una nueva categoria de pacientes
                $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/nuevo-usuario';

                if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                    Helper\Functions::redir($config['build']['url']);
                }

                $this->template->display($this->name_template, array(
                    'appBodyClass'  => 'page-profile',
                    'configuracion' => 'active',
                ));

            } elseif ($router->getMethod() == 'usuarios' && !is_null($router->getId()) && $router->getId() == 'editar') {

                # Agregar una nueva categoria de pacientes
                $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/editar-usuario';

                if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                    Helper\Functions::redir($config['build']['url']);
                }

                $this->template->display($this->name_template, array(
                    'appBodyClass'  => 'page-profile',
                    'configuracion' => 'active',
                ));

            } elseif ($router->getMethod() == 'usuarios' && !is_null($router->getId()) && $router->getId() == 'eliminar') {

                # Agregar una nueva categoria de pacientes
                $this->name_template = 'configuracion/roles/' . $this->user['rol'] . '/eliminar-usuario';

                if (!file_exists('./app/templates/' . $this->name_template . '.twig')) {
                    Helper\Functions::redir($config['build']['url']);
                }

                $this->template->display($this->name_template, array(
                    'appBodyClass'  => 'page-profile',
                    'configuracion' => 'active',
                ));

            } else {
                Helper\Functions::redir($config['build']['url'] . 'configuracion');
            }

        }

    }
}
