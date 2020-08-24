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
 * Modelo Citas
 */
class Citas extends Models implements IModels
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
     * Obtener citas pendientes de un Médico
     *
     * @return array : Con información de éxito/falla.
     */

    public function citasPendientes()
    {

        try {

            global $config, $http;

            # Set variables de funcion
            $codMedico   = $http->request->get('codigoMedico');
            $tipoHorario = $http->request->get('tipoHorario');
            $endDate     = $http->request->get('endDate');
            $start       = $http->request->get('start');
            $length      = $http->request->get('length');

            # Verificar que no están vacíos
            if (Helper\Functions::e($codMedico, $tipoHorario, $endDate, $start, $length)) {
                throw new ModelsException('Parámetros insuficientes para esta peticion.');
            }

            # Iniciar registro logs
            unset($this->logs);

            $task = array(
                'task'         => 'Nueva Peticion HTTP',
                'baseUri'      => $config['apiHm']['baseUrl'],
                'endpoint'     => $config['apiHm']['medicos']['citasAgendaPendientes'],
                'referencia'   => 'Citas Pasadas de un Medico.',
                'responseCode' => null,
            );

            $this->logs = $task;

            # Inicia cliente HTTP
            $this->generateKey();

            $client = new GClient(['base_uri' => $config['apiHm']['baseUrl']]);

            $response = $client->request('POST', $config['apiHm']['medicos']['citasAgendaPendientes'], [
                "headers"     => [
                    "Authorization" => $this->accessToken,
                ],
                'form_params' => [
                    'codigoMedico' => $codMedico,
                    'tipoHorario'  => $tipoHorario,
                    'endDate'      => $endDate,
                    'start'        => $start,
                    'length'       => $length,
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

                return array(
                    'status' => $data['status'],
                    'data'   => $data['data'],
                    'start'  => (int) $data['start'],
                    'length' => (int) $data['length'],
                    'logs'   => $this->logs,
                );

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

    public function NewCita()
    {

        try {

            global $config, $http;

            # Obtener los datos $_POST
            $idH    = $http->request->get('idH');
            $idT    = $http->request->get('idT');
            $nhcPte = $http->request->get('nhcPte');

            // Generar link de zoom
            $initZoom = new Model\Teleconsulta;

            $resZoom = $initZoom->setCallZoom();

            # 3setaridcita => contacto
            $id_contacto = $resZoom['data']->id;

            if ($resZoom['status']) {
                $url_zoom        = $config['build']['url'] . 'teleconsulta/live/' . $resZoom['data']->id;
                $url_zoom_public = 'https:' . $config['build']['url'] . 'live?idH=' . $idH . '&idT=' . $idT;
            } else {
                throw new ModelsException('Api Zoom no responde. No se puede generar una nueva cita. Reintente por favor.');
            }

            $data_cita = array(
                'id_call'  => $resZoom['data']->id,
                'join_url' => $resZoom['data']->join_url,
                'url_zoom' => $url_zoom,
            );

            $id_cita = $this->db->insert('citas', array(
                'idH'               => $idH,
                'idT'               => $idT,
                'nhcPte'            => $nhcPte,
                'idCall'            => $resZoom['data']->id,
                'licenciaZoom'      => $resZoom['licenciaZoom'],
                'status_live'       => 1,
                'data_cita'         => json_encode($data_cita, JSON_UNESCAPED_UNICODE),
                'user_create'       => $this->id_user,
                'timestammp_create' => time(),
            ));

            # SEND CORREO DE NOTIFICACION PACIENTE
            $this->sendMailPacienteZoom($url_zoom_public);

            return array(
                'status'   => true,
                'message'  => 'Teleconsulta generada con éxito.',
                'url'      => 'https:' . $url_zoom,
                'id_call'  => $resZoom['data']->id,
                'url_zoom' => $resZoom['data']->join_url,
                'logs'     => $id_cita,
            );

        } catch (ModelsException $e) {
            return array('status' => false, 'message' => $e->getMessage());
        }
    }

    public function sendMailPacienteZoom($link)
    {

        global $config, $http;

        # Construir mensaje y enviar mensaje
        $content = 'Muchas gracias por confiar en nosotros. Su Médico le esta esperando para iniciar su atención.
                    <br />
                    <br />
                    Para iniciar su atención <a href="' . $link . '" target="_blank">clic aquí</a> o en el botón de iniciar atención..';

        # Enviar el correo electrónico
        $_html = Helper\Emails::loadTemplate(array(
            # Título del mensaje
            '{{title}}'     => 'Su Médico le esta esperando para iniciar su atención. - ' . $config['build']['name'],
            # Contenido del mensaje
            '{{content}}'   => $content,
            # Url del botón
            '{{btn-href}}'  => $link,
            # Texto del boton
            '{{btn-name}}'  => 'Iniciar Atención',
            # Copyright
            '{{copyright}}' => '&copy; ' . date('Y') . ' <a href="' . $config['build']['url'] . '">' . $config['build']['name'] . '</a> Todos los derechos reservados.',
        ), 3);

        # Verificar si hubo algún problema con el envío del correo
        if ($this->sendMail($_html, 'mchang@hmetro.med.ec', 'Su Médico le esta esperando para iniciar su atención. - ' . $config['build']['name']) != 0) {
            throw new ModelsException('No se ha podido enviar el correo electrónico.');
        }
    }

/**
 * Sender mail api trx
 *
 * @return void
 */
    public function sendMail($html, $to, $subject)
    {

        global $config;

        $stringData = array(
            "TextBody" => "",
            'From'     => 'Telemedico telemedico@hospitalmetropolitano.org',
            'To'       => $to,
            'Subject'  => $subject,
            'HtmlBody' => $html,
        );

        $data = json_encode($stringData);

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, "https://api.trx.icommarketing.com/email");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Accept: application/json',
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data),
            'X-Postmark-Server-Token: ' . $config['mailer']['user'])
        );

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            $resultobj = curl_error($ch);
        }
        curl_close($ch);
        $resultobj = json_decode($result);

        return $resultobj->ErrorCode;

    }

    public function statusCita()
    {

        try {

            global $config, $http;

            $idH = $http->request->get('idH');
            $idT = $http->request->get('idT');

            $query = $this->db->select("*", 'citas', null, " idH='" . $idH . "' AND idT='" . $idT . "'  AND status_live='1' ", 1);

            # Incio de sesión con éxito
            if (false !== $query) {

                # Verificar si ya tiene un perfil asignado
                $data = json_decode($query[0]['data_cita'], true);

                return array(
                    'status' => true,
                    'link'   => $data['join_url'],
                );

            } else {

                throw new ModelsException('Todavía no se tiene conexión.');

            }

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
        $this->startDBConexion();

    }
}
