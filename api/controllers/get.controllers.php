<?php

/*
 * This file is part of the Ocrend Framewok 3 package.
 *
 * (c) Ocrend Software <info@ocrend.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use app\models as Model;
use Ocrend\Kernel\Helpers as Helper;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

$app->get('/', function () use ($app) {
    global $http;
    $temp = Helper\Strings::ocrend_decode($http->headers->get('X-REQUEST-T'), 'temp');
    $html = file_get_contents('../' . $temp);
    return $app->json(array($html));
});

$app->get('/modulos', function () use ($app) {
    $m = new Model\Users;
    return $app->json($m->getModulos());
});

$app->get('/usuarios', function () use ($app) {
    $m = new Model\Users;
    return $app->json($m->getUsers());
});

$app->get('/usuario', function () use ($app) {
    global $http;
    $m = new Model\Users;
    return $app->json($m->getUserById());
});

$app->get('/laboratorio/resultados/{codPersona}', function ($codPersona) use ($app) {
    $m = new Model\Laboratorio;
    return $app->json($m->getResultadosLab($codPersona));
});

$app->get('/laboratorio/resultado', function () use ($app) {
    global $http;
    $m = new Model\Laboratorio;
    return $app->json($m->getResultadosLabById(
        $http->headers->get('X-REQUEST-ID-DOCUMENTO'),
        $http->headers->get('X-REQUEST-FECHA-DOCUMENTO')
    ));
});

/**
 * DESPLIGUE DE DOCUMENTOS RESULTADOS DE LABORATORIO
 *
 * @return json
 */

$app->get('/documentos/resultados/{filename}', function ($filename = 'dummy.pdf') use ($app) {

    global $config;

    $file = '../assets/descargas/' . $filename;
    $doc  = file_exists($file);

    # si eiste documento renderizar elemtno
    if ($doc) {

        return new BinaryFileResponse($file);

    } else {

        $file = '../assets/descargas/dummy.pdf';
        return new BinaryFileResponse($file);
        // hrow new ModelsException('No existe el documento solicitado. => ' . $file);
    }

});

$app->get('/imagen/resultados/{hcpte}', function ($hcpte) use ($app) {
    $m = new Model\Imagen;
    return $app->json($m->getResultadosImg($hcpte));
});

/**
 * opciones de perfil
 *
 * @return json
 */
$app->get('/convenio', function () use ($app) {

    global $http;

    $track = $http->headers->get('X-REQUEST-TRACK');

    # si existe la accion para reeenviar verficacion por correo electronico
    if (!is_null($track)) {

        $u = new Model\Configuracion;
        switch ($track) {

            case 'view':
                return $app->json($u->getConvenio($http->headers->get('X-REQUEST-ID-CV'), '*'));
                break;

            default:
                return $app->json(array());
                break;
        }

    } else {
        return $app->json(array());
    }

});

/**
 * opciones de perfil
 *
 * @return json
 */
$app->get('/archivos', function () use ($app) {

    $u = new Model\Laboratorio;
    return $app->json($u->loadsPDF());

});

/**
 * opciones de perfil
 *
 * @return json
 */
$app->get('/pushconnect', function () use ($app) {

    $u = new Model\Laboratorio;
    return $app->json($u->pushConnect());

});

/**
 * Contactos
 *
 * @return json
 */
$app->get('/contactos', function () use ($app) {

    $u = new Model\Contactos;
    return $app->json($u->AllContacts());

});

/**
 * Devuelve todas las categorias creadas del userMedico
 *
 * @return json
 */
$app->get('/pacientes/categorias', function () use ($app) {

    $u = new Model\Pacientes;
    return $app->json($u->AllCategorias());

});

/**
 * Devuelve todas las categorias creadas del userMedico
 *
 * @return json
 */
$app->get('/pacientes/categorias/{idCategoria}', function ($idCategoria) use ($app) {
    $u = new Model\Pacientes;
    return $app->json($u->getCategoryById($idCategoria));
});

/**
 * Devuelve todas las usuarios del meico por roles
 *
 * @return json
 */
$app->get('/medicos/usuarios', function () use ($app) {
    $u = new Model\Usuarios;
    return $app->json($u->AllUsuarios());

});

/**
 * Devuelve todas las categorias creadas del userMedico
 *
 * @return json
 */
$app->get('/medicos/usuarios/{idUser}', function ($idUser) use ($app) {
    $u = new Model\Usuarios;
    return $app->json($u->getUserById($idUser));
});

/**
 * Devuelve todas las agendas creadas por el médico
 *
 * @return json
 */
$app->get('/medicos/agendas', function () use ($app) {
    $u = new Model\Agendas;
    return $app->json($u->getAgendas());
});

/**
 * Devuelve todas las agendas creadas por el médico
 *
 * @return json
 */
$app->get('/logs/{nhc}', function ($nhc) use ($app) {
    $u = new Model\Logs;
    return $app->json($u->getLogs($nhc));
});
