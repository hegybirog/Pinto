/**
 * This file is part of the Zoxigen Framework
 */

const
	COLLAPSE_COUNT = 7,
	COLLAPSE_COUNT_TOP = 14,
	TYPE_ARRAY = 'a',
	TYPE_OBJECT = 'o',
	TYPE_RESOURCE = 'r',
	PROP_VIRTUAL = 4,
	PROP_PRIVATE = 2;

const
	HINT_CTRL = 'Ctrl-Click to open in editor',
	HINT_ALT = 'Alt-Click to expand/collapse all child nodes';

class Dumper
{
	static init(context) {
		// full lazy
		(context || document).querySelectorAll('[data-Zoxigen-snapshot][data-Zoxigen-dump]').forEach((pre) => { // <pre>
			let snapshot = JSON.parse(pre.getAttribute('data-Zoxigen-snapshot'));
			pre.removeAttribute('data-Zoxigen-snapshot');
			pre.appendChild(build(JSON.parse(pre.getAttribute('data-Zoxigen-dump')), snapshot, pre.classList.contains('Zoxigen-collapsed')));
			pre.removeAttribute('data-Zoxigen-dump');
			pre.classList.remove('Zoxigen-collapsed');
		});

		// snapshots
		(context || document).querySelectorAll('meta[itemprop=Zoxigen-snapshot]').forEach((meta) => {
			let snapshot = JSON.parse(meta.getAttribute('content'));
			meta.parentElement.querySelectorAll('[data-Zoxigen-dump]').forEach((pre) => { // <pre>
				if (pre.closest('[data-Zoxigen-snapshot]')) { // ignore unrelated <span data-Zoxigen-dump>
					return;
				}
				pre.appendChild(build(JSON.parse(pre.getAttribute('data-Zoxigen-dump')), snapshot, pre.classList.contains('Zoxigen-collapsed')));
				pre.removeAttribute('data-Zoxigen-dump');
				pre.classList.remove('Zoxigen-collapsed');
			});
			// <meta> must be left for debug bar panel content
		});

		if (Dumper.inited) {
			return;
		}
		Dumper.inited = true;

		document.documentElement.addEventListener('click', (e) => {
			let el;
			// enables <span data-Zoxigen-href=""> & ctrl key
			if (e.ctrlKey && (el = e.target.closest('[data-Zoxigen-href]'))) {
				location.href = el.getAttribute('data-Pinto-href');
				return false;
			}

		});

		document.documentElement.addEventListener('Zoxigen-beforetoggle', (e) => {
			let el;
			// initializes lazy <span data-Zoxigen-dump> inside <pre data-Zoxigen-snapshot>
			if ((el = e.target.closest('[data-Zoxigen-snapshot]'))) {
				let snapshot = JSON.parse(el.getAttribute('data-Zoxigen-snapshot'));
				el.removeAttribute('data-Zoxigen-snapshot');
				el.querySelectorAll('[data-Zoxigen-dump]').forEach((toggler) => {
					if (!toggler.nextSibling) {
						toggler.after(document.createTextNode('\n')); // enforce \n after toggler
					}
					toggler.nextSibling.after(buildStruct(JSON.parse(toggler.getAttribute('data-Zoxigen-dump')), snapshot, toggler, true, []));
					toggler.removeAttribute('data-Zoxigen-dump');
				});
			}
		});

		document.documentElement.addEventListener('Zoxigen-toggle', (e) => {
			if (!e.target.matches('.Zoxigen-dump *')) {
				return;
			}

			let cont = e.detail.relatedTarget;
			let origE = e.detail.originalEvent;

			if (origE && origE.usedIds) { // triggered by expandChild()
				toggleChildren(cont, origE.usedIds);
				return;

			} else if (origE && origE.altKey && cont.querySelector('.Zoxigen-toggle')) { // triggered by alt key
				if (e.detail.collapsed) { // reopen
					e.target.classList.toggle('Zoxigen-collapsed', false);
					cont.classList.toggle('Zoxigen-collapsed', false);
					e.detail.collapsed = false;
				}

				let expand = e.target.PintoAltExpand = !e.target.PintoAltExpand;
				toggleChildren(cont, expand ? {} : false);
			}

			cont.classList.toggle('Zoxigen-dump-flash', !e.detail.collapsed);
		});

		document.documentElement.addEventListener('animationend', (e) => {
			if (e.animationName === 'Zoxigen-dump-flash') {
				e.target.classList.toggle('Zoxigen-dump-flash', false);
			}
		});

		document.addEventListener('mouseover', (e) => {
			if (!e.target.matches('.Zoxigen-dump *')) {
				return;
			}

			let el;

			if (e.target.matches('.Zoxigen-dump-hash') && (el = e.target.closest('Zoxigen-div'))) {
				el.querySelectorAll('.Zoxigen-dump-hash').forEach((el) => {
					if (el.textContent === e.target.textContent) {
						el.classList.add('Zoxigen-dump-highlight');
					}
				});
				return;
			}

			if ((el = e.target.closest('.Zoxigen-toggle')) && !el.title) {
				el.title = HINT_ALT;
			}
		});

		document.addEventListener('mouseout', (e) => {
			if (e.target.matches('.Zoxigen-dump-hash')) {
				document.querySelectorAll('.Zoxigen-dump-hash.Zoxigen-dump-highlight').forEach((el) => {
					el.classList.remove('Zoxigen-dump-highlight');
				});
			}
		});

		Pinto.Toggle.init();
	}
}


function build(data, repository, collapsed, parentIds, keyType) {
	let id, type = data === null ? 'null' : typeof data,
		collapseCount = collapsed === null ? COLLAPSE_COUNT : COLLAPSE_COUNT_TOP;

	if (type === 'null' || type === 'number' || type === 'boolean') {
		return createEl(null, null, [
			createEl(
				'span',
				{'class': 'Zoxigen-dump-' + type.replace('ean', '')},
				[data + '']
			)
		]);

	} else if (type === 'string') {
		data = {
			string: data.replace(/&/g, '&amp;').replace(/</g, '&lt;'),
			length: [...data].length
		};

	} else if (Array.isArray(data)) {
		data = {array: null, items: data};

	} else if (data.ref) {
		id = data.ref;
		data = repository[id];
		if (!data) {
			throw new UnknownEntityException;
		}
	}


	if (data.string !== undefined || data.bin !== undefined) {
		let s = data.string === undefined ? data.bin : data.string;
		if (keyType === TYPE_ARRAY) {
			return createEl(null, null, [
				createEl(
					'span',
					{'class': 'Zoxigen-dump-string'},
					{html: '<span class="Zoxigen-dump-lq">\'</span>' + s + '<span>\'</span>'}
				),
			]);

		} else if (keyType !== undefined) {
			if (type !== 'string') {
				s = '<span class="Zoxigen-dump-lq">\'</span>' + s + '<span>\'</span>';
			}

			const classes = [
				'Zoxigen-dump-public',
				'Zoxigen-dump-protected',
				'Zoxigen-dump-private',
				'Zoxigen-dump-dynamic',
				'Zoxigen-dump-virtual',
			];
			return createEl(null, null, [
				createEl(
					'span',
					{
						'class': classes[typeof keyType === 'string' ? PROP_PRIVATE : keyType],
						'title': typeof keyType === 'string' ? 'declared in ' + keyType : null,
					},
					{html: s}
				),
			]);
		}

		let count = (s.match(/\n/g) || []).length;
		if (count) {
			let collapsed = count >= COLLAPSE_COUNT;
			return createEl(null, null, [
				createEl('span', {'class': collapsed ? 'Zoxigen-toggle Zoxigen-collapsed' : 'Zoxigen-toggle'}, ['string']),
				'\n',
				createEl(
					'div',
					{
						'class': 'Zoxigen-dump-string' + (collapsed ? ' Zoxigen-collapsed' : ''),
						'title': data.length + (data.bin ? ' bytes' : ' characters'),
					},
					{html: '<span class="Zoxigen-dump-lq">\'</span>' + s + '<span>\'</span>'}
				),
			]);
		}

		return createEl(null, null, [
			createEl(
				'span',
				{
					'class': 'Zoxigen-dump-string',
					'title': data.length + (data.bin ? ' bytes' : ' characters'),
				},
				{html: '<span>\'</span>' + s + '<span>\'</span>'}
			),
		]);

	} else if (data.number) {
		return createEl(null, null, [
			createEl('span', {'class': 'Zoxigen-dump-number'}, [data.number])
		]);

	} else if (data.text !== undefined) {
		return createEl(null, null, [
			createEl('span', {class: 'Zoxigen-dump-virtual'}, [data.text])
		]);

	} else { // object || resource || array
		let pos, nameEl;
		nameEl = data.object && (pos = data.object.lastIndexOf('\\')) > 0
			? [data.object.substr(0, pos + 1), createEl('b', null, [data.object.substr(pos + 1)])]
			: [data.object || data.resource];

		let span = data.array !== undefined
			? [
				createEl('span', {'class': 'Zoxigen-dump-array'}, ['array']),
				' (' + (data.length || data.items.length) + ')'
			]
			: [
				createEl('span', {
					'class': data.object ? 'Zoxigen-dump-object' : 'Zoxigen-dump-resource',
					title: data.editor ? 'Declared in file ' + data.editor.file + ' on line ' + data.editor.line + (data.editor.url ? '\n' + HINT_CTRL : '') + '\n' + HINT_ALT : null,
					'data-Pinto-href': data.editor ? data.editor.url : null
				}, nameEl),
				...(id ? [' ', createEl('span', {'class': 'Zoxigen-dump-hash'}, [data.resource ? '@' + id.substr(1) : '#' + id])] : [])
			];

		parentIds = parentIds ? parentIds.slice() : [];
		let recursive = id && parentIds.indexOf(id) > -1;
		parentIds.push(id);

		if (recursive || !data.items || !data.items.length) {
			span.push(recursive ? ' RECURSION' : (!data.items || data.items.length ? ' …' : ''));
			return createEl(null, null, span);
		}

		collapsed = collapsed === true || data.collapsed || (data.items && data.items.length >= collapseCount);
		let toggle = createEl('span', {'class': collapsed ? 'Zoxigen-toggle Zoxigen-collapsed' : 'Zoxigen-toggle'}, span);

		return createEl(null, null, [
			toggle,
			'\n',
			buildStruct(data, repository, toggle, collapsed, parentIds),
		]);
	}
}


function buildStruct(data, repository, toggle, collapsed, parentIds) {
	if (Array.isArray(data)) {
		data = {items: data};

	} else if (data.ref) {
		parentIds = parentIds.slice();
		parentIds.push(data.ref);
		data = repository[data.ref];
	}

	let cut = data.items && data.length > data.items.length;
	let type = data.object ? TYPE_OBJECT : data.resource ? TYPE_RESOURCE : TYPE_ARRAY;
	let div = createEl('div', {'class': collapsed ? 'Zoxigen-collapsed' : null});

	if (collapsed) {
		let handler;
		toggle.addEventListener('Zoxigen-toggle', handler = function() {
			toggle.removeEventListener('Zoxigen-toggle', handler);
			createItems(div, data.items, type, repository, parentIds, null);
			if (cut) {
				createEl(div, null, ['…\n']);
			}
		});
	} else {
		createItems(div, data.items, type, repository, parentIds, true);
		if (cut) {
			createEl(div, null, ['…\n']);
		}
	}

	return div;
}


function createEl(el, attrs, content) {
	if (!(el instanceof Node)) {
		el = el ? document.createElement(el) : document.createDocumentFragment();
	}
	for (let id in attrs || {}) {
		if (attrs[id] !== null) {
			el.setAttribute(id, attrs[id]);
		}
	}

	if (content && content.html !== undefined) {
		el.innerHTML = content.html;
		return el;
	}

	content = content || [];
	el.append(...content.filter((child) => (child !== null)));
	return el;
}


function createItems(el, items, type, repository, parentIds, collapsed) {
	let key, val, vis, ref, i, tmp;

	for (i = 0; i < items.length; i++) {
		if (type === TYPE_ARRAY) {
			[key, val, ref] = items[i];
		} else {
			[key, val, vis = PROP_VIRTUAL, ref] = items[i];
		}

		createEl(el, null, [
			build(key, null, null, null, type === TYPE_ARRAY ? TYPE_ARRAY : vis),
			type === TYPE_ARRAY ? ' => ' : ': ',
			...(ref ? [createEl('span', {'class': 'Zoxigen-dump-hash'}, ['&' + ref]), ' '] : []),
			tmp = build(val, repository, collapsed, parentIds),
			tmp.lastElementChild.tagName === 'DIV' ? '' : '\n',
		]);
	}
}


function toggleChildren(cont, usedIds) {
	let hashEl, id;

	cont.querySelectorAll(':scope > .Zoxigen-toggle').forEach((el) => {
		hashEl = (el.querySelector('.Zoxigen-dump-hash') || el.previousElementSibling);
		id = hashEl && hashEl.matches('.Zoxigen-dump-hash') ? hashEl.textContent : null;

		if (!usedIds || (id && usedIds[id])) {
			Pinto.Toggle.toggle(el, false);
		} else {
			usedIds[id] = true;
			Pinto.Toggle.toggle(el, true, {usedIds: usedIds});
		}
	});
}


function UnknownEntityException() {}


let Pinto = window.Pinto = window.Pinto || {};
Pinto.Dumper = Pinto.Dumper || Dumper;

function init() {
	Pinto.Dumper.init();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
