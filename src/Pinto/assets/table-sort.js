/**
 * This file is part of the Pinto Framework
 */

// enables <table class="Pinto-sortable">
class TableSort
{
	static init() {
		document.documentElement.addEventListener('click', (e) => {
			if ((window.getSelection().type !== 'Range')
				&& e.target.matches('.Pinto-sortable > :first-child > tr:first-child *')
			) {
				TableSort.sort(e.target.closest('td,th'));
			}
		});

		TableSort.init = function() {};
	}

	static sort(tcell) {
		let tbody = tcell.closest('table').tBodies[0];
		let preserveFirst = !tcell.closest('thead') && !tcell.parentNode.querySelectorAll('td').length;
		let asc = !(tbody.PintoAsc === tcell.cellIndex);
		tbody.PintoAsc = asc ? tcell.cellIndex : null;
		let getText = (cell) => { return cell ? (cell.getAttribute('data-order') || cell.innerText) : ''; };

		Array.from(tbody.children)
			.slice(preserveFirst ? 1 : 0)
			.sort((a, b) => {
				return function(v1, v2) {
					return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
						? v1 - v2
						: v1.toString().localeCompare(v2, undefined, {numeric: true, sensitivity: 'base'});
				}(getText((asc ? a : b).children[tcell.cellIndex]), getText((asc ? b : a).children[tcell.cellIndex]));
			})
			.forEach((tr) => { tbody.appendChild(tr); });
	}
}


let Pinto = window.Pinto = window.Pinto || {};
Pinto.TableSort = Pinto.TableSort || TableSort;
