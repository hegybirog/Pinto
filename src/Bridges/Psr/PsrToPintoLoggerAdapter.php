<?php

/**
 * This file is part of the Pinto Framework
 * Copyright (c) Pinto (http://zoxigen.com)
 */


namespace Pinto\Bridges\Psr;

use Psr;
use Pinto;


/**
 * Psr\Log\LoggerInterface to Pinto\ILogger adapter.
 */
class PsrToPintoLoggerAdapter implements Pinto\ILogger
{
	/** Pinto logger level to PSR-3 log level mapping */
	private const LevelMap = [
		Pinto\ILogger::DEBUG => Psr\Log\LogLevel::DEBUG,
		Pinto\ILogger::INFO => Psr\Log\LogLevel::INFO,
		Pinto\ILogger::WARNING => Psr\Log\LogLevel::WARNING,
		Pinto\ILogger::ERROR => Psr\Log\LogLevel::ERROR,
		Pinto\ILogger::EXCEPTION => Psr\Log\LogLevel::ERROR,
		Pinto\ILogger::CRITICAL => Psr\Log\LogLevel::CRITICAL,
	];


	public function __construct(
		private Psr\Log\LoggerInterface $psrLogger,
	) {
	}


	public function log(mixed $value, string $level = self::INFO)
	{
		if ($value instanceof \Throwable) {
			$message = get_debug_type($value) . ': ' . $value->getMessage() . ($value->getCode() ? ' #' . $value->getCode() : '') . ' in ' . $value->getFile() . ':' . $value->getLine();
			$context = ['exception' => $value];

		} elseif (!is_string($value)) {
			$message = trim(Pinto\Dumper::toText($value));
			$context = [];

		} else {
			$message = $value;
			$context = [];
		}

		$this->psrLogger->log(
			self::LevelMap[$level] ?? Psr\Log\LogLevel::ERROR,
			$message,
			$context,
		);
	}
}
