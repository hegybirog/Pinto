<?php

/**
 * This file is part of the Zoxigen Framework
 * Copyright (c) Zoxigen (http://zoxigen.com)
 */


if (!function_exists('dump')) {
	/**
	 * Zoxigen\Debugger::dump() shortcut.
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
	 * Zoxigen\Debugger::dump() & exit shortcut.
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
	 * Zoxigen\Debugger::barDump() shortcut.
	 * @PintoSkipLocation
	 */
	function bdump(mixed $var): mixed
	{
		Pinto\Debugger::barDump(...func_get_args());
		return $var;
	}
}
