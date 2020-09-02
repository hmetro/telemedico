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
 * Modelo GEMAReportes
 */
class GEMAReportes extends Models implements IModels
{

    use DBModel;

    # Variables de clase

    /**
     * Log de respuestas HTTP
     *
     * @var array
     */

    private $logs = array();

    /**
     * KEY JWT api hm
     *
     * @var array
     */

    private $accessToken = null;

    /**
     * Obtener key para aplicacion
     *
     * @return array : Con información de éxito/falla.
     */

    public function generateKey()
    {

        $client = new GClient();

        $response = $client->request('POST', 'https://api.hospitalmetropolitano.org/teleconsulta/beta/v1/login', [
            'form_params' => [
                'DNI'  => '1501128480',
                'PASS' => '1501128480',
            ],
            'debug'       => false,
            'verify'      => false,
        ]);

        # Verificar error de peticion Http
        if ($response->getStatusCode() !== 200) {

            throw new ModelsException('Api Teleconsulta HM. No responde satisfactoriamente.');
        }

        # Set response
        $data = json_decode($response->getBody(), true);

        # Set response
        if ($data['status']) {

            $this->accessToken = $data['user_token'];

        } else {

            throw new ModelsException($data['message']);

        }

    }

    /**
     * Obtener PDF de recurso HC de un Paciente
     *
     * @return array : Con información de éxito/falla.
     */

    public function getReporte002()
    {

        try {

            global $config, $http;

            # Set variables de funcion
            $numHistoriaClinica = $http->request->get('numeroHistoriaClinica');
            $numAdmision        = $http->request->get('numeroAdmision');

            # Verificar que no están vacíos
            if (Helper\Functions::e($numHistoriaClinica, $numAdmision)) {
                throw new ModelsException('Parámetros insuficientes para esta peticion.');
            }

            # Iniciar registro logs
            unset($this->logs);

            $task = array(
                'task'         => 'Nueva Peticion HTTP',
                'baseUri'      => $config['apiHm']['baseUrl'],
                'endpoint'     => $config['apiHm']['medicos']['reporteHC'],
                'referencia'   => 'Reporte 002 Consulta Externa.',
                'responseCode' => null,
            );

            $this->logs = $task;

            # Verificar si el reporte ya existe
            $reporteGema = 'downloads/reportes/gema/002/' . $numHistoriaClinica . '-' . $numAdmision . '.pdf';

            if (file_exists($reporteGema)) {

                return array(
                    'status' => true,
                    'url'    => $config['build']['url'] . 'api/downloads/reportes/gema/002/' . $numHistoriaClinica . '-' . $numAdmision . '.pdf',
                    'logs'   => $this->logs,
                );

            }

            # Inicia cliente HTTP
            $this->generateKey();

            $client = new GClient(['base_uri' => $config['apiHm']['baseUrl']]);

            $response = $client->request('POST', $config['apiHm']['medicos']['reporteHC'], [
                "headers"     => [
                    "Authorization" => $this->accessToken,
                ],
                'form_params' => [
                    'numeroHistoriaClinica' => $numHistoriaClinica,
                    'numeroAdmision'        => $numAdmision,
                ],
                'debug'       => false,
                'verify'      => false,
            ]);

            # Set Logs
            $this->logs['responseCode'] = $response->getStatusCode();

            # Verificar error de peticion Http
            if ($response->getStatusCode() !== 200) {

                throw new ModelsException('Api Teleconsulta HM. No responde satisfactoriamente.');
            }

            # Set response

            $data = json_decode($response->getBody(), true);

            # Set response
            if ($data['status']) {

                # Descargar recurso
                $downloadReporte = $this->downloadReporte($numHistoriaClinica, $numAdmision);

                if ($downloadReporte) {

                    return array(
                        'status' => true,
                        'url'    => $config['build']['url'] . 'api/downloads/reportes/gema/002/' . $numHistoriaClinica . '-' . $numAdmision . '.pdf',
                        'logs'   => $this->logs,
                    );

                } else {

                    throw new ModelsException('Reporte no se pudo obtener desde GEMA.');

                }

            } else {

                $this->logs['errorCode'] = $data['errorCode'];

                throw new ModelsException($data['message']);

            }

        } catch (ModelsException $e) {

            return array(
                'status'  => false,
                'data'    => array(),
                'message' => $e->getMessage(),
                'logs'    => $this->logs,
            );

        }

    }

    public function downloadReporte($mhc, $adm)
    {
        $url = "https://reportes.hmetro.med.ec/reports/rwservlet?keyreportpdf&server=rep_proyectodesarro&report=g_hicli_9_msp.rep&pn_institucion=1&pn_paciente=" . $mhc . "&pn_admision=" . $adm;

        $destination = 'downloads/reportes/gema/002/' . $mhc . '-' . $adm . '.pdf';

        $source = file_get_contents($url);
        file_put_contents($destination, $source);
        return true;

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
