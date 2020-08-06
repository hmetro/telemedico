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
 * Modelo Usuarios

 */
class Usuarios extends Models implements IModels
{

    use DBModel;

    # Variables de clase

    public function AllUsuarios()
    {

        $roles_medicos = $this->db->select('*', "roles_medicos");

        # No hay resultados
        #

        if (false == $roles_medicos) {

            return array(
                'status'     => false,
                'customData' => false,
            );

        }

        $arrRolesMedicos = array();

        foreach ($roles_medicos as $key) {
            $key['id']         = Helper\Strings::ocrend_encode($key['id'], 'temp');
            $arrRolesMedicos[] = $key;
        }

        # Si hay resultados

        return array(
            'status'     => true,
            'customData' => $arrRolesMedicos,
        );
    }

    public function getUserById(string $idUser)
    {

        $idUser = Helper\Strings::ocrend_decode($idUser, 'temp');

        $roles_medicos = $this->db->select('*', "roles_medicos", null, "id='" . $idUser . "'");

        # No hay resultados

        if (false == $roles_medicos) {

            return array(
                'status'     => false,
                'customData' => $roles_medicos,
            );

        }

        # Si hay resultados

        return array(
            'status'     => true,
            'customData' => $roles_medicos,
        );
    }

    public function NuevoUsuario()
    {

        try {

            global $config, $http;

            # Obtener los datos $_POST
            $user    = $this->db->scape($http->request->get('user'));
            $pass    = $this->db->scape($http->request->get('pass'));
            $userMed = $this->db->scape($http->request->get('userMed'));

            # Verificar que no están vacíos
            if (Helper\Functions::e($user, $pass)) {
                throw new ModelsException('Todos los datos son necesarios');
            }

            $this->db->insert('roles_medicos', array(
                'user'    => $user,
                'pass'    => Helper\Strings::hash($pass),
                'role'    => '2',
                'userMed' => $userMed,
            ));

            return array(
                'status'  => true,
                'message' => 'Usuario creado con éxito.',

            );

        } catch (ModelsException $e) {
            return array('status' => false, 'message' => $e->getMessage());
        }
    }

    public function editarUsuario()
    {

        try {

            global $config, $http;

            $put = json_decode($http->getContent(), true);
            # Obtener los datos $_POST
            $idUser = Helper\Strings::ocrend_decode($put['idUser'], 'temp');
            $user   = $this->db->scape($put['user']);
            $pass   = $this->db->scape($put['pass']);

            # Verificar que no están vacíos
            if (Helper\Functions::e($user, $pass)) {
                throw new ModelsException('Todos los datos son necesarios');
            }

            $this->db->update('roles_medicos', array(
                'user' => $user,
                'pass' => Helper\Strings::hash($pass),
                'role' => '2',
            ), "id='" . $idUser . "'", 1);

            return array(
                'status'  => true,
                'message' => 'Usuario actualizada con éxito.',

            );

        } catch (ModelsException $e) {
            return array('status' => false, 'message' => $e->getMessage());
        }
    }

    public function eliminarUsuario()
    {

        try {

            global $config, $http;

            $del = json_decode($http->getContent(), true);

            # Obtener los datos $_POST
            $idUser = Helper\Strings::ocrend_decode($del['idUser'], 'temp');

            $this->db->delete('roles_medicos', "id='" . $idUser . "'", 1);

            return array(
                'status'  => true,
                'message' => 'Usuario eliminada con éxito.',
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
