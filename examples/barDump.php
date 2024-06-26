<?php


require __DIR__ . '/../src/Pinto.php';

use Pinto\Debugger;

// For security reasons, Pinto is visible only on localhost.
// You may force Pinto to run in development mode by passing the Debugger::Development instead of Debugger::Detect.
Debugger::enable(Debugger::Detect, __DIR__ . '/log');

?>
<!DOCTYPE html><html class=arrow><link rel="stylesheet" href="assets/style.css">

<h1>Pinto: bar dump demo</h1>

<p>You can dump variables to bar in rightmost bottom egde.</p>

<?php
$arr = [10, 20.2, true, null, 'hello', (object) null, []];

bdump(get_defined_vars());

bdump($arr, 'The Array');

bdump('<a href="#">test</a>', 'String');


if (Debugger::$productionMode) {
	echo '<p><b>For security reasons, Pinto is visible only on localhost. Look into the source code to see how to enable Pinto.</b></p>';
}
