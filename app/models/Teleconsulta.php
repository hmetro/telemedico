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
use Ocrend\Kernel\Helpers as Helper;
use Ocrend\Kernel\Models\IModels;
use Ocrend\Kernel\Models\Models;
use Ocrend\Kernel\Models\ModelsException;
use Ocrend\Kernel\Models\Traits\DBModel;
use Ocrend\Kernel\Router\IRouter;

/**
 * Modelo Teleconsulta
 */
class Teleconsulta extends Models implements IModels
{

    use DBModel;

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
    private $activeLicencia = null;
    private $idCall         = null;

    public function setCallZoom()
    {

        try {

            global $config, $http;

            # Extraer licencia activa
            $this->getActiveLicencia();

            $getToken = new Model\Auth;

            $accessToken = $getToken->generateKey()['zoom_token'];

            $client = new GClient(['base_uri' => 'https://api.zoom.us']);

            $response = $client->request('POST', '/v2/users/' . $this->activeLicencia . '/meetings', [
                "headers" => [
                    "Authorization" => "Bearer $accessToken",
                ],
                'json'    => [
                    "topic"    => "Telecosnulta HM Id: " . time(),
                    "type"     => 1,
                    "duration" => 30,
                    "password" => "123456",
                    "timezone" => "America/Bogota",
                    'settings' => [
                        'auto_recording' => 'cloud',
                    ],
                ],
            ]);

            $data = json_decode($response->getBody());

            return array(
                'status'       => true,
                'message'      => 'Proceso realizado con éxito',
                'data'         => $data,
                'licenciaZoom' => $this->activeLicencia,
            );

        } catch (ModelsException $e) {
            return array('status' => false, 'message' => $e->getMessage());
        }
    }

    public function deleteCallZoom()
    {

        try {

            global $config, $http;

            $id_call = $http->request->get('id_call');

            # Verificar que no están vacíos
            if (Helper\Functions::e($id_call)) {
                throw new ModelsException('Todos los datos son necesarios');
            }

            $getToken = new Model\Auth;

            $accessToken = $getToken->generateKey()['zoom_token'];

            $client = new GClient(['base_uri' => 'https://api.zoom.us']);

            $response = $client->request('PUT', '/v2/meetings/' . $id_call . '/status', [
                "headers" => [
                    "Authorization" => "Bearer $accessToken",
                ],
                'json'    => [
                    "action" => 'end',
                ],
            ]);

            #Liberar licencia

            $this->idCall = $id_call;

            $this->setFreeLicencia();

            return array(
                'status'        => true,
                'message'       => 'Proceso realizado con éxito',
                'getStatusCode' => $response->getStatusCode(),
            );

        } catch (ModelsException $e) {
            return array('status' => false, 'message' => $e->getMessage());
        }
    }

    public function getParticipantesCall()
    {

        try {

            global $config, $http;

            $id_call = $http->request->get('id_call');

            # Verificar que no están vacíos
            if (Helper\Functions::e($id_call)) {
                throw new ModelsException('Todos los datos son necesarios. => Id_call es necesario.');
            }

            $getToken = new Model\Auth;

            $accessToken = $getToken->generateKey()['zoom_token'];

            $client = new GClient(['base_uri' => 'https://api.zoom.us']);

            $response = $client->request('GET', '/v2/metrics/meetings/' . $id_call . '/participants?page_size=30&type=live', [
                "headers" => [
                    "Authorization" => "Bearer $accessToken",
                ],
            ]);

            $data = json_decode($response->getBody());

            return array(
                'status'       => true,
                'message'      => 'Request éxito',
                'data'         => $data,
                'totalRecords' => $data->total_records,
            );

        } catch (ModelsException $e) {
            return array('status' => false, 'message' => $e->getMessage());
        }
    }

    public function getActiveLicencia()
    {

        try {

            $licencias = $this->db->select('*', "licenciasZoom", null, " status='0' ", 1);

            # No hay resultados
            if (false === $licencias) {
                throw new ModelsException('No existe una licencia disponible.');
            }

            $this->activeLicencia = $licencias[0]['correo'];

            # Ocupar licencia

            $this->setActiveLicencia();

        } catch (ModelsException $e) {
            return array('status' => false, 'message' => $e->getMessage());
        }
    }

    public function setActiveLicencia()
    {

        $this->db->update('licenciasZoom', array(
            'status'          => 1,
            'timestampStatus' => time(),
        ), " correo='" . $this->activeLicencia . "' ", 1);

    }

    public function setFreeLicencia()
    {

        $query = $this->db->select("*",
            'citas',
            null,
            " idCall='" . $this->idCall . "' ",
            1
        );

        $this->activeLicencia = $query[0]['licenciaZoom'];

        # liberar licencia

        $this->db->update('licenciasZoom', array(
            'status'          => 0,
            'timestampStatus' => time(),
        ), " correo='" . $this->activeLicencia . "' ", 1);

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
