<?php

/**
 * This file is part of the Pinto Framework
 * Copyright (c) Pinto (http://zoxigen.com)
 */


if (!function_exists('dump')) {
	/**
	 * Pinto\Debugger::dump() shortcut.
	 * @PintoSkipLocation
	 */
	function dump(mixed $var): mixed
	{
		array_map([Pinto\Debugger::class, 'dump'], func_get_args());
		return $var;
	}
}

if (!function_exists('dumpe')) {
	/**
	 * Pinto\Debugger::dump() & exit shortcut.
	 * @PintoSkipLocation
	 */
	function dumpe(mixed $var): void
	{
		array_map([Pinto\Debugger::class, 'dump'], func_get_args());
		if (!Pinto\Debugger::$productionMode) {
			exit;
		}
	}
}

if (!function_exists('bdump')) {
	/**
	 * Pinto\Debugger::barDump() shortcut.
	 * @PintoSkipLocation
	 */
	function bdump(mixed $var): mixed
	{
		Pinto\Debugger::barDump(...func_get_args());
		return $var;
	}
}
