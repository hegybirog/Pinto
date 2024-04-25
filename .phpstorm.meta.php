<?php


namespace PHPSTORM_META;

expectedArguments(\Pinto\Debugger::log(), 1, \Pinto\ILogger::DEBUG, \Pinto\ILogger::INFO, \Pinto\ILogger::WARNING, \Pinto\ILogger::ERROR, \Pinto\ILogger::EXCEPTION, \Pinto\ILogger::CRITICAL);
expectedArguments(\Pinto\ILogger::log(), 1, \Pinto\ILogger::DEBUG, \Pinto\ILogger::INFO, \Pinto\ILogger::WARNING, \Pinto\ILogger::ERROR, \Pinto\ILogger::EXCEPTION, \Pinto\ILogger::CRITICAL);

exitPoint(\dumpe());
