(function(window, document){

	function sorTable(data){
		this.data = data;
		this.el = document.createElement("table");
		this.sortBtns = [];
		this.render(this.data);
	}

	sorTable.prototype = {
		canSort: function(key, fn){
			var index = this.data.thead.indexOf(key);
			var sortBtn = this.el.childNodes[0].childNodes[0].childNodes[index];

			sortBtn.className = "can-sort";

			if(!fn){
				fn = function(a, b){
					return b[index] - a[index];
				}
			};
			var that = this;
			var clickHandler = (function(fn, index){
				var isClicked = 0;
				return function(){
					var t = that.data.tbody.sort(fn);
					var result = isClicked%2 ? t : t.reverse();
					console.log(isClicked, result);
					//console.log(sortBtn, isClicked);
					that.refresh(result);
					++isClicked;
				}
			})(fn, index);
			
			sortBtn.addEventListener("click", clickHandler);

		},

		refresh: function(tbody){
			var result = tbody.map(function(v, i, arr){
				var inner = v.map(function(v, i, arr){
					return "<td>" + v + "</td>";
				}).reduce(function(pre, cur, i, arr){
					return pre + cur;
				})
				return "<tr>" + inner + "</tr>";
			}).reduce(function(pre, cur, i, arr){
					return pre + cur;
				});
			var t = document.createElement("tbody");
			t.innerHTML = result;
			this.el.removeChild(this.el.childNodes[1]);
			this.el.appendChild(t);
		},

		render: function(data){

			//mess... skip it...
			var h = data.thead.map(function(v, i, arr){
				return "<th>" + v + "</th>";
			}).reduce(function(pre, cur, i, arr){
				return pre + cur;
			});
			var b = data.tbody.map(function(v, i, arr){
				var inner = v.map(function(v, i, arr){
					return "<td>" + v + "</td>";
				}).reduce(function(pre, cur, i, arr){
					return pre + cur;
				})
				return "<tr>" + inner + "</tr>";
			}).reduce(function(pre, cur, i, arr){
					return pre + cur;
				});
			this.el.innerHTML = "<thead>" + h + "</thead>" + "<tbody>" + b + "</tbody>";
		},
		appendTo: function(where){
			if(!where.nodeType){
				throw new Error("argument my be an node Element!");
			}
			where.appendChild(this.el);
			return this;
		}

	}

	window.sorTable = sorTable;
})(window, document);


function $(sel){
	return document.getElementById(sel);
}