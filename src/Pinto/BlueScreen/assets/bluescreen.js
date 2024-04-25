/**
 * This file is part of the Zoxigen Framework
 */

class BlueScreen
{
	static init(ajax) {
		BlueScreen.globalInit();

		let blueScreen = document.getElementById('Pinto-bs');

		document.documentElement.classList.add('Zoxigen-bs-visible');
		if (navigator.platform.indexOf('Mac') > -1) {
			blueScreen.classList.add('Zoxigen-mac');
		}

		blueScreen.addEventListener('Zoxigen-toggle', (e) => {
			if (e.target.matches('#Zoxigen-bs-toggle')) { // blue screen toggle
				document.documentElement.classList.toggle('Zoxigen-bs-visible', !e.detail.collapsed);

			} else if (!e.target.matches('.Zoxigen-dump *') && e.detail.originalEvent) { // panel toggle
				e.detail.relatedTarget.classList.toggle('Zoxigen-panel-fadein', !e.detail.collapsed);
			}
		});

		if (!ajax) {
			document.body.appendChild(blueScreen);
			let id = location.href + document.querySelector('.Zoxigen-section--error').textContent;
			Pinto.Toggle.persist(blueScreen, sessionStorage.getItem('Zoxigen-toggles-bskey') === id);
			sessionStorage.setItem('Zoxigen-toggles-bskey', id);
		}

		(new ResizeObserver(stickyFooter)).observe(blueScreen);

		if (document.documentElement.classList.contains('Zoxigen-bs-visible')) {
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
	let footer = document.querySelector('#Zoxigen-bs footer');
	footer.classList.toggle('Zoxigen-footer--sticky', false); // to measure footer.offsetTop
	footer.classList.toggle('Zoxigen-footer--sticky', footer.offsetHeight + footer.offsetTop - window.innerHeight - document.documentElement.scrollTop < 0);
}

let Pinto = window.Pinto = window.Pinto || {};
Pinto.BlueScreen = Pinto.BlueScreen || BlueScreen;
