<?php

/**
 * This file is part of the Pinto Framework
 * Copyright (c) Pinto (http://zoxigen.com)
 */


namespace Pinto;


interface SessionStorage
{
	function isAvailable(): bool;

	function &getData(): array;
}
