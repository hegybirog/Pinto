<?php

/**
 * This file is part of the Pinto Framework
 * Copyright (c) Pinto (http://zoxigen.com)
 */


namespace Pinto;


/**
 * IBarPanel implementation helper.
 * @internal
 */
#[\AllowDynamicProperties]
class DefaultBarPanel implements IBarPanel
{
	public $data;

	private $id;


	public function __construct(string $id)
	{
		$this->id = $id;
	}


	/**
	 * Renders HTML code for custom tab.
	 */
	public function getTab(): string
	{
		return Helpers::capture(function () {
			$data = $this->data;
			require __DIR__ . "/panels/{$this->id}.tab.phtml";
		});
	}


	/**
	 * Renders HTML code for custom panel.
	 */
	public function getPanel(): string
	{
		return Helpers::capture(function () {
			if (is_file(__DIR__ . "/panels/{$this->id}.panel.phtml")) {
				$data = $this->data;
				require __DIR__ . "/panels/{$this->id}.panel.phtml";
			}
		});
	}
}
