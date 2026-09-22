<?php

require __DIR__ . '/verify.php';

// A separate PHP process proves recovery uses the durable record, not live
// document objects or request-local copies of the old nested values.
\verbb\vizy\Vizy::$plugin->getContentRecovery()->restore((int)$argv[1]);
echo "Restored\n";
