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
use GuzzleHttp\Client as GClient;
use Ocrend\Kernel\Models\IModels;
use Ocrend\Kernel\Models\Models;
use Ocrend\Kernel\Router\IRouter;

/**
 * Modelo Laboratorio
 */
class Teleconsulta extends Models implements IModels
{

    # Variables de clase
    private $pstrSessionKey = 0;
    private $USER           = null;
    private $sortField      = 'ROWNUM';
    private $sortType       = 'desc'; # desc
    private $start          = 1;
    private $length         = 10;
    private $searchField    = null;
    private $startDate      = null;
    private $endDate        = null;
    private $tresMeses      = null;
    private $_conexion      = null;
    private $dia            = null;
    private $mes            = null;
    private $anio           = null;
    private $hora           = null;
    private $hash           = null;
    private $id_convenio    = null;
    private $name_convenio  = null;
    private $zoomToken      = null;

    /**
     * ROL MINIMO PARA MANIPULACION DEL USUARIO
     *
     * @var int
     */

    const ROL_USER = 4;

    public function setCallZoom()
    {

        try {

            global $config, $http;

            $getToken = new Model\Auth;

            $accessToken = $getToken->generateKey()['zoom_token'];

            $client = new GClient(['base_uri' => 'https://api.zoom.us']);

            $response = $client->request('POST', '/v2/users/' . $config['zoom']['api_user'] . '/meetings', [
                "headers" => [
                    "Authorization" => "Bearer $accessToken",
                ],
                'json'    => [
                    "topic"    => "API Test Teleconsulta " . time(),
                    "type"     => 1,
                    "duration" => 15,
                    "password" => "123456",
                    "timezone" => "America/Bogota",
                ],
            ]);

            $data = json_decode($response->getBody());

            return array('status' => true, 'message' => 'Proceso realizado con éxito', 'data' => $data);

        } catch (ModelsException $e) {
            return array('status' => false, 'message' => $e->getMessage());
        }
    }

/**
 * __construct()
 */

    public function __construct(IRouter $router = null)
    {
        parent::__construct($router);

    }
}
