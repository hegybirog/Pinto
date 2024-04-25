/**
 * This file is part of the Pinto Framework
 */

// enables .Pinto-tabs, .Pinto-tab-label, .Pinto-tab-panel, .Pinto-active
class Tabs
{
	static init() {
		document.documentElement.addEventListener('click', (e) => {
			let label, context;
			if (
				!e.shiftKey && !e.ctrlKey && !e.metaKey
				&& (label = e.target.closest('.Pinto-tab-label'))
				&& (context = e.target.closest('.Pinto-tabs'))
			) {
				Tabs.toggle(context, label);
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		});

		Tabs.init = function() {};
	}

	static toggle(context, label) {
		let labels = context.querySelector('.Pinto-tab-label').parentNode.querySelectorAll('.Pinto-tab-label'),
			panels = context.querySelector('.Pinto-tab-panel').parentNode.querySelectorAll(':scope > .Pinto-tab-panel');

		for (let i = 0; i < labels.length; i++) {
			labels[i].classList.toggle('Pinto-active', labels[i] === label);
		}

		for (let i = 0; i < panels.length; i++) {
			panels[i].classList.toggle('Pinto-active', labels[i] === label);
		}
	}
}


let Pinto = window.Pinto = window.Pinto || {};
Pinto.Tabs = Pinto.Tabs || Tabs;
