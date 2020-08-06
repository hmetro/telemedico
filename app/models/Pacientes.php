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
 * Modelo Pacientes

 */
class Pacientes extends Models implements IModels
{

    use DBModel;

    # Variables de clase

    public function AllCategorias()
    {

        $categorias = $this->db->select('*', "ptes_categorias");

        # No hay resultados
        #

        if (false == $categorias) {

            return array(
                'status'     => false,
                'customData' => false,
            );

        }

        $arrCategorias = array();

        foreach ($categorias as $key) {
            $key['id']       = Helper\Strings::ocrend_encode($key['id'], 'temp');
            $arrCategorias[] = $key;
        }

        # Si hay resultados

        return array(
            'status'     => true,
            'customData' => $arrCategorias,
        );
    }

    public function getCategoryById(string $idCategoria)
    {

        $idCategoria = Helper\Strings::ocrend_decode($idCategoria, 'temp');

        $categorias = $this->db->select('*', "ptes_categorias", null, "id='" . $idCategoria . "'");

        # No hay resultados

        if (false == $categorias) {

            return array(
                'status'     => false,
                'customData' => $categorias,
            );

        }

        # Si hay resultados

        return array(
            'status'     => true,
            'customData' => $categorias,
        );
    }

    public function NuevaCategoria()
    {

        try {

            global $config, $http;

            # Obtener los datos $_POST
            $nombreCategoria = $this->db->scape($http->request->get('nombre-categoria'));

            # Verificar que no están vacíos
            if (Helper\Functions::e($nombreCategoria)) {
                throw new ModelsException('Todos los datos son necesarios');
            }

            $this->db->insert('ptes_categorias', array(
                'categoria' => $nombreCategoria,
            ));

            return array(
                'status'  => true,
                'message' => 'Categoría creada con éxito.',

            );

        } catch (ModelsException $e) {
            return array('status' => false, 'message' => $e->getMessage());
        }
    }

    public function editarCategoria()
    {

        try {

            global $config, $http;

            $put = json_decode($http->getContent(), true);
            # Obtener los datos $_POST
            $idCategoria     = Helper\Strings::ocrend_decode($put['idCategoria'], 'temp');
            $nombreCategoria = $this->db->scape($put['nombreCategoria']);

            # Verificar que no están vacíos
            if (Helper\Functions::e($nombreCategoria)) {
                throw new ModelsException('Todos los datos son necesarios');
            }

            $this->db->update('ptes_categorias', array(
                'categoria' => $nombreCategoria,
            ), "id='" . $idCategoria . "'", 1);

            return array(
                'status'  => true,
                'message' => 'Categoría actualizada con éxito.',

            );

        } catch (ModelsException $e) {
            return array('status' => false, 'message' => $e->getMessage());
        }
    }

    public function eliminarCategoria()
    {

        try {

            global $config, $http;

            $del = json_decode($http->getContent(), true);

            # Obtener los datos $_POST
            $idCategoria = Helper\Strings::ocrend_decode($del['idCategoria'], 'temp');

            $this->db->delete('ptes_categorias', "id='" . $idCategoria . "'", 1);

            return array(
                'status'  => true,
                'message' => 'Categoría eliminada con éxito.',

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
