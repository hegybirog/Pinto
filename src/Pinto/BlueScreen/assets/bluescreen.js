/**
 * This file is part of the Pinto Framework
 */

class BlueScreen
{
	static init(ajax) {
		BlueScreen.globalInit();

		let blueScreen = document.getElementById('Pinto-bs');

		document.documentElement.classList.add('Pinto-bs-visible');
		if (navigator.platform.indexOf('Mac') > -1) {
			blueScreen.classList.add('Pinto-mac');
		}

		blueScreen.addEventListener('Pinto-toggle', (e) => {
			if (e.target.matches('#Pinto-bs-toggle')) { // blue screen toggle
				document.documentElement.classList.toggle('Pinto-bs-visible', !e.detail.collapsed);

			} else if (!e.target.matches('.Pinto-dump *') && e.detail.originalEvent) { // panel toggle
				e.detail.relatedTarget.classList.toggle('Pinto-panel-fadein', !e.detail.collapsed);
			}
		});

		if (!ajax) {
			document.body.appendChild(blueScreen);
			let id = location.href + document.querySelector('.Pinto-section--error').textContent;
			Pinto.Toggle.persist(blueScreen, sessionStorage.getItem('Pinto-toggles-bskey') === id);
			sessionStorage.setItem('Pinto-toggles-bskey', id);
		}

		(new ResizeObserver(stickyFooter)).observe(blueScreen);

		if (document.documentElement.classList.contains('Pinto-bs-visible')) {
			window.scrollTo(0, 0);
		}
	}


	static globalInit() {
		// enables toggling via ESC
		document.addEventListener('keyup', (e) => {
			if (e.keyCode === 27 && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) { // ESC
				Pinto.Toggle.toggle(document.getElementById('Pinto-bs-toggle'));
			}
		});

		Pinto.TableSort.init();
		Pinto.Tabs.init();

		window.addEventListener('scroll', stickyFooter);

		BlueScreen.globalInit = function() {};
	}


	static loadAjax(content) {
		let ajaxBs = document.getElementById('Pinto-bs');
		if (ajaxBs) {
			ajaxBs.remove();
		}
		document.body.insertAdjacentHTML('beforeend', content);
		ajaxBs = document.getElementById('Pinto-bs');
		Pinto.Dumper.init(ajaxBs);
		BlueScreen.init(true);
	}
}

function stickyFooter() {
	let footer = document.querySelector('#Pinto-bs footer');
	footer.classList.toggle('Pinto-footer--sticky', false); // to measure footer.offsetTop
	footer.classList.toggle('Pinto-footer--sticky', footer.offsetHeight + footer.offsetTop - window.innerHeight - document.documentElement.scrollTop < 0);
}

let Pinto = window.Pinto = window.Pinto || {};
Pinto.BlueScreen = Pinto.BlueScreen || BlueScreen;
