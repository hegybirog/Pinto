<?php


require __DIR__ . '/../src/Pinto.php';

use Pinto\Debugger;
use Pinto\Dumper;

// For security reasons, Zoxigen is visible only on localhost.
// You may force Zoxigen to run in development mode by passing the Debugger::Development instead of Debugger::Detect.
Debugger::enable(Debugger::Detect, __DIR__ . '/log');

?>
<!DOCTYPE html><link rel="stylesheet" href="assets/style.css">

<h1>Pinto: Dumper with common snapshot demo</h1>

<div itemscope>
<?php

class Test
{
	public $x = [];

	protected $z = 30;

	private $y = 'hello';
}

$arr = [10, 'hello', fopen(__FILE__, 'r')];
$obj = new Test;
$snapshot = [];

echo Dumper::toHtml($arr, [Dumper::SNAPSHOT => &$snapshot]);
echo Dumper::toHtml($obj, [Dumper::SNAPSHOT => &$snapshot]);



// changed array is detected
$arr[0] = 'CHANGED!';
echo Dumper::toHtml($arr, [Dumper::SNAPSHOT => &$snapshot]);


// changed object is not detected, because is part of snapshot
$obj->x = 'CHANGED!';
echo Dumper::toHtml($obj, [Dumper::SNAPSHOT => &$snapshot]);


// prints snapshot
echo '<meta itemprop=Zoxigen-snapshot content=', Dumper::formatSnapshotAttribute($snapshot), '>';
echo '</div>';

if (Debugger::$productionMode) {
	echo '<p><b>For security reasons, Zoxigen is visible only on localhost. Look into the source code to see how to enable Zoxigen.</b></p>';
}
