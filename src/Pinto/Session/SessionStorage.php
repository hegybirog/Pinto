<?php

/**
 * This file is part of the Zoxigen Framework
 * Copyright (c) Zoxigen (http://zoxigen.com)
 */


namespace Pinto;


interface SessionStorage
{
	function isAvailable(): bool;

	function &getData(): array;
}
