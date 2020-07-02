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
use Ocrend\Kernel\Helpers as Helper;
use Ocrend\Kernel\Models\IModels;
use Ocrend\Kernel\Models\Models;
use Ocrend\Kernel\Models\ModelsException;
use Ocrend\Kernel\Models\Traits\DBModel;
use Ocrend\Kernel\Router\IRouter;

/**
 * Modelo Laboratorio
 */
class Contactos extends Models implements IModels
{

    use DBModel;
    # Variables de clase

    public function AllContacts()
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

    public function NewContact()
    {

        try {

            global $config, $http;

            # Obtener los datos $_POST
            $hclinica = $this->db->scape($http->request->get('hclinica'));
            $contacto = $this->db->scape($http->request->get('contacto'));
            $correo   = $this->db->scape($http->request->get('correo'));

            # Verificar que no están vacíos
            if (Helper\Functions::e($hclinica, $contacto, $correo)) {
                throw new ModelsException('Todos los datos son necesarios');
            }

            $id_contact = $this->db->insert('contactos', array(
                'hclinica'  => $hclinica,
                'contacto'  => $contacto,
                'correo'    => $correo,
                'user'      => $this->id_user,
                'timestamp' => time(),
            ));

            return array(
                'status'  => true,
                'message' => 'Contacto registrado con éxito.',

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
