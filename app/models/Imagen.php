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
use Doctrine\DBAL\DriverManager;
use Ocrend\Kernel\Models\IModels;
use Ocrend\Kernel\Models\Models;
use Ocrend\Kernel\Models\ModelsException;
use Ocrend\Kernel\Router\IRouter;

/**
 * Modelo Imagen
 */
class Imagen extends Models implements IModels
{

    # Variables de clase
    private $pstrSessionKey = 0;
    private $cod_paciente   = null;
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
    private $hash           = 'SC';
    private $id_convenio    = null;
    private $name_convenio  = null;

    /**
     * Conexion
     *
     */

    private function conectar_Oracle()
    {
        global $config;

        $_config = new \Doctrine\DBAL\Configuration();
//..
        # SETEAR LA CONNEXION A LA BASE DE DATOS DE ORACLE GEMA
        $this->_conexion = \Doctrine\DBAL\DriverManager::getConnection($config['database']['drivers']['oracle'], $_config);

    }

    private function setSpanishOracle()
    {

        # 71001 71101
        $sql = "alter session set NLS_LANGUAGE = 'SPANISH'";
        # Execute
        $stmt = $this->_conexion->query($sql);

        $sql = "alter session set NLS_TERRITORY = 'SPAIN'";
        # Execute
        $stmt = $this->_conexion->query($sql);

        $sql = " alter session set NLS_DATE_FORMAT = 'DD/MM/YYYY' ";
        # Execute
        $stmt = $this->_conexion->query($sql);

    }

    private function errorsPagination()
    {

        if ($this->length > 10) {
            throw new ModelsException('!Error! Solo se pueden mostrar 10 resultados por página.');
        }

    }

    public function getResultadosImg($hcpte)
    {

        try {

            global $config, $http;

            # ERRORES DE PETICION
            $this->errorsPagination();

            # seteo de valores para paginacion
            $this->start = (int) $http->query->get('start');

            $this->length = (int) $http->query->get('length');

            $this->cod_paciente = $hcpte;

            if ($this->start >= 10) {
                $this->length = $this->start + 10;
            }

            $sql = " SELECT *
                FROM (
                  SELECT b.*, ROWNUM AS NUM
                  FROM (
                    SELECT *
                    FROM WEB_RESULTADOS_IMG
                    ORDER BY FECHA DESC
                  ) b
                  WHERE ROWNUM <= " . $this->length . "
                  AND COD_PERSONA = " . $this->cod_paciente . "
                  AND TOT_SC != TOD_DC
                  ORDER BY FECHA DESC
                )
                WHERE NUM > " . $this->start . " ";

            # Conectar base de datos
            $this->conectar_Oracle();

            # set spanish
            $this->setSpanishOracle();

            # Execute
            $stmt = $this->_conexion->query($sql);

            # cERRAR CONEXION
            $this->_conexion->close();

            # VERIFICAR RESULTADOS
            $data = $stmt->fetchAll();

            # NO EXITEN RESULTADOS
            $this->notResults($data);

            # Datos de usuario cuenta activa
            $resultados = array();

            foreach ($data as $key) {

                $key['ID_RESULTADO'] = $key['SC'];
                unset($key['TOT_SC']);
                unset($key['TOD_DC']);
                unset($key['ROWNUM']);

                $resultados[] = $key;
            }

            # Ya no existe resultadso
            $this->notResults($resultados);

            # Devolver Información
            return array(
                'status'     => true,
                'customData' => $resultados,
                'total'      => count($resultados),
                'start'      => intval($this->start),
                'length'     => intval($this->length),
            );

        } catch (ModelsException $e) {

            return array('status' => false, 'message' => $e->getMessage());

        }

    }

    private function notResults(array $data)
    {
        if (count($data) == 0) {
            return array(
                'status'     => true,
                'customData' => false,
                'total'      => 0,
                'start'      => 1,
                'length'     => 10,
                # 'dataddd' => $http->request->all(),
            );
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
