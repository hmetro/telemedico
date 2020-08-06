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

/**
 * Actualiza un registro de categoria
 *
 * @return json
 */
$app->put('/pacientes/categorias', function () use ($app) {
    $u = new Model\Pacientes;
    return $app->json($u->editarCategoria());
});

/**
 * Actualiza un registro de categoria
 *
 * @return json
 */
$app->put('/medicos/usuarios', function () use ($app) {
    $u = new Model\Usuarios;
    return $app->json($u->editarUsuario());
});
