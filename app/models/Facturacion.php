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
 * Modelo Facturación
 */

class Facturacion extends Models implements IModels
{

    public function getFacturasMedico()
    {

        try {

            global $config;

            $client = new GClient(['base_uri' => $config['apiHm']['baseUrl']]);

            $response = $client->post($config['apiHm']['medicos']['facturacion'], [
                'json' => ['numeroMes' => '7', 'codigoMedico' => '999'],
            ]);

            # Estatus de respuesta 200

            if ($response->getStatusCode() == 200) {

                $data = json_decode($response->getBody(), true);

                return $data;

            } else {

                throw new ModelsException($config['messageErrors']['sinResultados']);
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

    }
}
