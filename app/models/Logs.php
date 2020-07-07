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
 * Modelo Logs
 *
 * Registra todas las peticiones HTTP desde la aplicacion
 */
class Logs extends Models implements IModels
{

    use DBModel;
    # Variables de clase

    public function insertLogs()
    {

        global $http;

        # Obtener los datos $_POST
        $headers = $http->headers->all();
        $body    = $http->request->all();

        $logs = $this->db->insert('logs', array(
            'data'      => json_encode(array('headers' => $headers, 'body' => $body), JSON_UNESCAPED_UNICODE),
            'timestamp' => time(),
        ));

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
