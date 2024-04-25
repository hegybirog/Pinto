<?php

/**
 * This file is part of the Pinto Framework
 * Copyright (c) Pinto (http://zoxigen.com)
 */


namespace Pinto;


/**
 * Custom output for Debugger.
 */
interface IBarPanel
{
	/**
	 * Renders HTML code for custom tab.
	 * @return string
	 */
	function getTab();

	/**
	 * Renders HTML code for custom panel.
	 * @return string
	 */
	function getPanel();
}
