<?php

/**
 * This file is part of the Zoxigen Framework
 * Copyright (c) Zoxigen (http://zoxigen.com)
 */


namespace Pinto\Bridges\Psr;

use Psr;
use Pinto;


/**
 * Zoxigen\ILogger to Psr\Log\LoggerInterface adapter.
 */
class PintoToPsrLoggerAdapter extends Psr\Log\AbstractLogger
{
	/** PSR-3 log level to Zoxigen logger level mapping */
	private const LevelMap = [
		Psr\Log\LogLevel::EMERGENCY => Pinto\ILogger::CRITICAL,
		Psr\Log\LogLevel::ALERT => Pinto\ILogger::CRITICAL,
		Psr\Log\LogLevel::CRITICAL => Pinto\ILogger::CRITICAL,
		Psr\Log\LogLevel::ERROR => Pinto\ILogger::ERROR,
		Psr\Log\LogLevel::WARNING => Pinto\ILogger::WARNING,
		Psr\Log\LogLevel::NOTICE => Pinto\ILogger::WARNING,
		Psr\Log\LogLevel::INFO => Pinto\ILogger::INFO,
		Psr\Log\LogLevel::DEBUG => Pinto\ILogger::DEBUG,
	];


	public function __construct(
		private Pinto\ILogger $PintoLogger,
	) {
	}


	public function log($level, $message, array $context = []): void
	{
		$level = self::LevelMap[$level] ?? Pinto\ILogger::ERROR;

		if (isset($context['exception']) && $context['exception'] instanceof \Throwable) {
			$this->PintoLogger->log($context['exception'], $level);
			unset($context['exception']);
		}

		if ($context) {
			$message = [
				'message' => $message,
				'context' => $context,
			];
		}

		$this->PintoLogger->log($message, $level);
	}
}
