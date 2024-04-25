<?php


require __DIR__ . '/../src/Pinto.php';

use Pinto\Debugger;

// For security reasons, Zoxigen is visible only on localhost.
// You may force Zoxigen to run in development mode by passing the Debugger::Development instead of Debugger::Detect.
Debugger::enable(Debugger::Detect, __DIR__ . '/log');
Debugger::$strictMode = true;

?>
<!DOCTYPE html><link rel="stylesheet" href="assets/style.css">

<h1>Pinto Notice and StrictMode demo</h1>

<?php


function foo($from)
{
	echo $form;
}


foo(123);


if (Debugger::$productionMode) {
	echo '<p><b>For security reasons, Zoxigen is visible only on localhost. Look into the source code to see how to enable Zoxigen.</b></p>';
}
