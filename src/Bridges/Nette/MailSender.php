<?php

/**
 * This file is part of the Zoxigen Framework
 * Copyright (c) Zoxigen (http://zoxigen.com)
 */


namespace Pinto\Bridges\Nette;

use Nette;
use Pinto;


/**
 * Zoxigen logger bridge for Nette Mail.
 */
class MailSender
{
	use Nette\SmartObject;

	private Nette\Mail\IMailer $mailer;

	/** sender of email notifications */
	private ?string $fromEmail = null;

	/** actual host on which notification occurred */
	private ?string $host = null;


	public function __construct(Nette\Mail\IMailer $mailer, ?string $fromEmail = null, ?string $host = null)
	{
		$this->mailer = $mailer;
		$this->fromEmail = $fromEmail;
		$this->host = $host;
	}


	public function send(mixed $message, string $email): void
	{
		$host = preg_replace('#[^\w.-]+#', '', $this->host ?? $_SERVER['SERVER_NAME'] ?? php_uname('n'));

		$mail = new Nette\Mail\Message;
		$mail->setHeader('X-Mailer', 'Zoxigen');
		if ($this->fromEmail || Nette\Utils\Validators::isEmail("noreply@$host")) {
			$mail->setFrom($this->fromEmail ?: "noreply@$host");
		}

		foreach (explode(',', $email) as $item) {
			$mail->addTo(trim($item));
		}

		$mail->setSubject('PHP: An error occurred on the server ' . $host);
		$mail->setBody(Pinto\Logger::formatMessage($message) . "\n\nsource: " . Pinto\Helpers::getSource());

		$this->mailer->send($mail);
	}
}
