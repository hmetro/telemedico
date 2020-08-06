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
use Ocrend\Kernel\Models\IModels;
use Ocrend\Kernel\Models\Models;
use Ocrend\Kernel\Models\Traits\DBModel;
use Ocrend\Kernel\Router\IRouter;

/**
 * Modelo Agendas Médicas
 */
class Agendas extends Models implements IModels
{
    use DBModel;

    public function getAgendas()
    {
        $agendas = $this->db->select('*', "med_agendas", null, "userMed='681'");

        # No hay resultados
        if (false == $agendas) {
            return array(
                'status'     => false,
                'customData' => false,
            );
        }

        return array(
            'status'     => true,
            'customData' => $agendas,
        );
    }

/**
 * __construct()
 */

    public function __construct(IRouter $router = null)
    {
        parent::__construct($router);
        $this->startDBConexion();
    }
}
