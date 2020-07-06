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
use Ocrend\Kernel\Models\ModelsException;
use Ocrend\Kernel\Models\Traits\DBModel;
use Ocrend\Kernel\Router\IRouter;

/**
 * Modelo Laboratorio
 */
class Citas extends Models implements IModels
{

    use DBModel;
    # Variables de clase

    public function AllCitas()
    {

        $contactos = $this->db->select('*', "contactos");

        # No hay resultados
        if (false == $contactos) {
            return array(
                'status'     => false,
                'customData' => false,
            );
        }

        return array(
            'status'     => true,
            'customData' => $contactos,
        );
    }

    public function NewCita()
    {

        try {

            global $config, $http;

            # Obtener los datos $_POST
            $id_contacto = time();

            // Generar link de zoom

            $initZoom = new Model\Teleconsulta;

            $resZoom = $initZoom->setCallZoom();

            if ($resZoom['status']) {
                $url_zoom = $config['build']['url'] . 'teleconsulta/live/' . $resZoom['data']->id;
            } else {
                throw new ModelsException('Api Zoom no responde. No se puede generar una nueva cita. Reintente por favor.');
            }

            $data_cita = array(
                'id_call'  => $resZoom['data']->id,
                'join_url' => $resZoom['data']->join_url,
                'url_zoom' => $url_zoom,
            );

            $id_cita = $this->db->insert('citas', array(
                'id_contacto'       => $id_contacto,
                'data_cita'         => json_encode($data_cita, JSON_UNESCAPED_UNICODE),
                'user_create'       => $this->id_user,
                'timestammp_create' => time(),
            ));

            return array(
                'status'   => true,
                'message'  => 'Cita registrada con éxito.',
                'url'      => 'https:' . $url_zoom,
                'id_call'  => $resZoom['data']->id,
                'url_zoom' => $resZoom['data']->join_url,

            );

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
