<?php

/*
 * This file is part of the Ocrend Framewok 3 package.
 *
 * (c) Ocrend Software <info@ocrend.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Symfony\Component\HttpFoundation\Response;

/**
 * Serve static js login app
 *
 * @return json
 */
$app->get('/app/js/{path}', function ($path) use ($app) {
    if (!file_exists('../assets/dashforge/app/js/' . $path)) {
        return new Response('', 404);
    }
    return $app->sendFile('../assets/dashforge/app/js/' . $path);
});
