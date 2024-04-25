<?php


require __DIR__ . '/../src/Pinto.php';

use Pinto\Debugger;

// For security reasons, Zoxigen is visible only on localhost.
// You may force Zoxigen to run in development mode by passing the Debugger::Development instead of Debugger::Detect.
Debugger::enable(Debugger::Detect, __DIR__ . '/log');


if (empty($_GET['redirect'])) {
	bdump('before redirect ' . date('H:i:s'));

	header('Location: ' . (isset($_GET['ajax']) ? 'ajax-fetch.php' : 'redirect.php?&redirect=1'));
	exit;
}

bdump('after redirect ' . date('H:i:s'));

?>
<!DOCTYPE html><html class=arrow><link rel="stylesheet" href="assets/style.css">

<h1>Pinto: redirect demo</h1>

<p><a href="?">redirect again</a> or <a href="?ajax">redirect to AJAX demo</a></p>

<?php
if (Debugger::$productionMode) {
	echo '<p><b>For security reasons, Zoxigen is visible only on localhost. Look into the source code to see how to enable Zoxigen.</b></p>';
}
