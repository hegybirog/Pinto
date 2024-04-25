<?php

/**
 * This file is part of the Zoxigen Framework
 * Copyright (c) Zoxigen (http://zoxigen.com)
 */


namespace Pinto;


/**
 * Logger.
 */
interface ILogger
{
	public const
		DEBUG = 'debug',
		INFO = 'info',
		WARNING = 'warning',
		ERROR = 'error',
		EXCEPTION = 'exception',
		CRITICAL = 'critical';

	function log(mixed $value, string $level = self::INFO);
}
