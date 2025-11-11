import{a as p}from"./react-DrzH4biM.js";var s={exports:{}},m={};/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h;function D(){if(h)return m;h=1;var f=p();function E(r,u){return r===u&&(r!==0||1/r===1/u)||r!==r&&u!==u}var V=typeof Object.is=="function"?Object.is:E,j=f.useSyncExternalStore,w=f.useRef,z=f.useEffect,M=f.useMemo,_=f.useDebugValue;return m.useSyncExternalStoreWithSelector=function(r,u,d,v,o){var t=w(null);if(t.current===null){var n={hasValue:!1,value:null};t.current=n}else n=t.current;t=M(function(){function S(e){if(!R){if(R=!0,c=e,e=v(e),o!==void 0&&n.hasValue){var i=n.value;if(o(i,e))return l=i}return l=e}if(i=l,V(c,e))return i;var W=v(e);return o!==void 0&&o(i,W)?(c=e,i):(c=e,l=W)}var R=!1,c,l,b=d===void 0?null:d;return[function(){return S(u())},b===null?void 0:function(){return S(b())}]},[u,d,v,o]);var a=j(r,t[0],t[1]);return z(function(){n.hasValue=!0,n.value=a},[a]),_(a),a},m}var y;function O(){return y||(y=1,s.exports=D()),s.exports}var q=O();export{q as w};
