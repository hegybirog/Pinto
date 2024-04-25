<?php

/**
 * This file is part of the Pinto Framework
 * Copyright (c) Pinto (http://zoxigen.com)
 */


namespace Pinto;


class NativeSession implements SessionStorage
{
	public function isAvailable(): bool
	{
		return session_status() === PHP_SESSION_ACTIVE;
	}


	public function &getData(): array
	{
		settype($_SESSION['_Pinto'], 'array');
		return $_SESSION['_Pinto'];
	}
}
