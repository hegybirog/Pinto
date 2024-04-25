<?php


require __DIR__ . '/../src/Pinto.php';

use Pinto\Debugger;

// For security reasons, Pinto is visible only on localhost.
// You may force Pinto to run in development mode by passing the Debugger::Development instead of Debugger::Detect.
Debugger::enable(Debugger::Detect, __DIR__ . '/log');

?>
<!DOCTYPE html><link rel="stylesheet" href="assets/style.css">

<h1>Pinto: fatal error demo</h1>

<?php

if (Debugger::$productionMode) {
	echo '<p><b>For security reasons, Pinto is visible only on localhost. Look into the source code to see how to enable Pinto.</b></p>';
}

require __DIR__ . '/assets/E_COMPILE_ERROR.php';
