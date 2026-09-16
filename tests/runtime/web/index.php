<?php
// The bootstrap refuses to run outside this checkout's owned, disposable DDEV
// project. Real CP tests use Craft's normal web application and session/CSRF.
require dirname(__DIR__) . '/bootstrap.php';
$app = require CRAFT_VENDOR_PATH . '/craftcms/cms/bootstrap/web.php';
$app->run();
