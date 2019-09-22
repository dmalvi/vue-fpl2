(function(t){function e(e){for(var n,r,o=e[0],l=e[1],c=e[2],d=0,f=[];d<o.length;d++)r=o[d],i[r]&&f.push(i[r][0]),i[r]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(t[n]=l[n]);u&&u(e);while(f.length)f.shift()();return s.push.apply(s,c||[]),a()}function a(){for(var t,e=0;e<s.length;e++){for(var a=s[e],n=!0,o=1;o<a.length;o++){var l=a[o];0!==i[l]&&(n=!1)}n&&(s.splice(e--,1),t=r(r.s=a[0]))}return t}var n={},i={app:0},s=[];function r(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=t,r.c=n,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(a,n,function(e){return t[e]}.bind(null,n));return a},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/vue-fpl2/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],l=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var u=l;s.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"034f":function(t,e,a){"use strict";var n=a("64a9"),i=a.n(n);i.a},"56d7":function(t,e,a){"use strict";a.r(e);a("cadf"),a("551c"),a("097d");var n=a("2b0e"),i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("Aspside")],1)},s=[],r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"main-container",on:{click:t.extend}},[a("div",{staticClass:"header-container"},[a("span",{staticClass:"title-text"},[t._v("\n      FPL "),a("big",[t._v("|")]),t._v(" Aspside\n    ")],1)]),t.fetchedTeamData.length&&!t.loading?a("div",{staticClass:"table-container"},[a("table",{staticClass:"league-table"},[a("thead",{staticClass:"league-header"},[a("tr",{staticClass:"header-row"},[a("th",{staticClass:"rank-header rank"},[t._v("#")]),a("th",{staticClass:"a-left"},[t._v("Team")]),a("th",{staticClass:"a-left"},[t._v("Captain")]),a("transition",{attrs:{name:"slide-fade"}},[t.extended?a("th",{staticClass:"a-left"},[t._v("Vice Captain")]):t._e()]),a("th",{staticClass:"a-center"},[t._v("GW"+t._s(t.gw))]),a("th",{staticClass:"a-center tot"},[t._v("Total")])],1)]),t._l(t.fetchedTeamData,function(e,n){return a("tbody",{key:e.rank,staticClass:"league-body"},[a("tr",{staticClass:"team-row"},[a("td",{staticClass:"rank-col rank"},[a("span",{staticClass:"rank-content"},[t._v(t._s(n+1))])]),a("td",{staticClass:"a-left"},[t._v(t._s(e["Team"])+" ")]),a("td",{staticClass:"a-left"},[t._v(t._s(e["Captain"].replace(/([(\d)])/g,"")))]),a("transition",{attrs:{name:"slide-fade"}},[t.extended?a("td",{staticClass:"a-left"},[t._v(t._s(e["Vice-Captain"].replace(/([(\d)])/g,"")))]):t._e()]),a("td",{staticClass:"a-center"},[t._v(t._s(e["Live Points"]))]),a("td",{staticClass:"a-right tot"},[a("strong",[t._v(t._s(e["Total"]))])])],1)])})],2)]):t._e(),t.loading?a("div",[a("div",{staticClass:"loader"}),a("h3",{staticClass:"status"},[t._v(t._s(t.statusMsg))])]):t._e(),a("div",{staticClass:"info-box",style:{visibility:t.infoVisibility}},[a("div",{staticClass:"info-text"},[t._v("Click / Tap anywhere to switch view")])])])},o=[],l=(a("55dd"),a("96cf"),a("3b8d"));function c(t,e){return t.Total>e.Total?-1:t.Total<e.Total?1:0}var u={data:function(){return{teams:[],details:[],playersDb:[],loading:!1,allTeamDetails:[],gw:"",statusMsg:"",gwData:[],extended:!1,infoVisibility:"hidden",cred:{method:"GET",headers:{"Content-Type":"application/json"}},fetchedTeamData:[]}},created:function(){this.fetchData()},watch:{loading:function(t){t||(this.infoVisibility="visible",setTimeout(this.toggleInfo,3e3))}},methods:{toggleInfo:function(){"visible"===this.infoVisibility?this.infoVisibility="hidden":this.infoVisibility="visible"},extend:function(){this.extended=!this.extended},fetchData:function(){var t=Object(l["a"])(regeneratorRuntime.mark(function t(){var e,a,n;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.loading=!0,e="https://cors-anywhere.herokuapp.com/https://www.anewpla.net/fpl/league/json.php?id=7168",t.next=4,fetch(e,this.cred).then(function(t){return t.json()});case 4:return a=t.sent,t.next=7,a.data;case 7:n=t.sent,this.fetchedTeamData=n.sort(c),this.loading=!1;case 10:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}()}},d=u,f=(a("7977"),a("2877")),p=Object(f["a"])(d,r,o,!1,null,null,null);p.options.__file="Aspside.vue";var h=p.exports,v={name:"app",components:{Aspside:h}},_=v,b=(a("034f"),Object(f["a"])(_,i,s,!1,null,null,null));b.options.__file="App.vue";var g=b.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(t){return t(g)}}).$mount("#app")},"64a9":function(t,e,a){},7977:function(t,e,a){"use strict";var n=a("8854"),i=a.n(n);i.a},8854:function(t,e,a){}});
//# sourceMappingURL=app.04e0946d.js.map