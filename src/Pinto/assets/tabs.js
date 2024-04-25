/**
 * This file is part of the Zoxigen Framework
 */

// enables .Zoxigen-tabs, .Zoxigen-tab-label, .Zoxigen-tab-panel, .Zoxigen-active
class Tabs
{
	static init() {
		document.documentElement.addEventListener('click', (e) => {
			let label, context;
			if (
				!e.shiftKey && !e.ctrlKey && !e.metaKey
				&& (label = e.target.closest('.Zoxigen-tab-label'))
				&& (context = e.target.closest('.Zoxigen-tabs'))
			) {
				Tabs.toggle(context, label);
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		});

		Tabs.init = function() {};
	}

	static toggle(context, label) {
		let labels = context.querySelector('.Zoxigen-tab-label').parentNode.querySelectorAll('.Zoxigen-tab-label'),
			panels = context.querySelector('.Zoxigen-tab-panel').parentNode.querySelectorAll(':scope > .Zoxigen-tab-panel');

		for (let i = 0; i < labels.length; i++) {
			labels[i].classList.toggle('Zoxigen-active', labels[i] === label);
		}

		for (let i = 0; i < panels.length; i++) {
			panels[i].classList.toggle('Zoxigen-active', labels[i] === label);
		}
	}
}


let Pinto = window.Pinto = window.Pinto || {};
Pinto.Tabs = Pinto.Tabs || Tabs;
