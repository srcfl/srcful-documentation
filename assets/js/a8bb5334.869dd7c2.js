"use strict";(self.webpackChunksrcful_documentation=self.webpackChunksrcful_documentation||[]).push([[8756],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>g});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=p(n),d=a,g=c["".concat(s,".").concat(d)]||c[d]||m[d]||o;return n?r.createElement(g,i(i({ref:t},u),{},{components:n})):r.createElement(g,i({ref:t},u))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3009:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_label:"\ud83d\udee0\ufe0f Setup Guide: Energy Gateway",sidebar_position:0,sidebar_class_name:"item1"},i="Setup Guide: Energy Gateway",l={unversionedId:"guide",id:"guide",title:"Setup Guide: Energy Gateway",description:"- You will need a compatible inverter to connect your Energy Gateway. Please see our list of compatible inverters//docs.srcful.io/energy-gateway/compatible-inverter/",source:"@site/docs/guide.md",sourceDirName:".",slug:"/guide",permalink:"/guide",draft:!1,tags:[],version:"current",sidebarPosition:0,frontMatter:{sidebar_label:"\ud83d\udee0\ufe0f Setup Guide: Energy Gateway",sidebar_position:0,sidebar_class_name:"item1"},sidebar:"tutorialSidebar",next:{title:"Overview",permalink:"/"}},s={},p=[{value:"Getting started",id:"getting-started",level:2},{value:"Pairing over Bluetooth",id:"pairing-over-bluetooth",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Location",id:"location",level:2},{value:"Troubleshooting",id:"troubleshooting",level:2}],u={toc:p},c="wrapper";function m(e){let{components:t,...o}=e;return(0,a.kt)(c,(0,r.Z)({},u,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"setup-guide-energy-gateway"},"Setup Guide: Energy Gateway"),(0,a.kt)("admonition",{title:"Important",type:"info"},(0,a.kt)("ul",{parentName:"admonition"},(0,a.kt)("li",{parentName:"ul"},"You will need a compatible inverter to connect your Energy Gateway. Please see our list of compatible inverters: ",(0,a.kt)("a",{parentName:"li",href:"https://docs.srcful.io/energy-gateway/compatible-inverter/"},"https://docs.srcful.io/energy-gateway/compatible-inverter/")),(0,a.kt)("li",{parentName:"ul"},"You will need a Solana Wallet to configure your Energy Gateway and to get beta token rewards. See our instructional video on how to set up Phantom: ",(0,a.kt)("a",{parentName:"li",href:"https://youtu.be/5G5H3nmAgwM"},"https://youtu.be/5G5H3nmAgwM")))),(0,a.kt)("h2",{id:"getting-started"},"Getting started"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"Connect the Energy Gateway")," to the internet using an Ethernet cable, and power it on by connecting the power cable.")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"Wait approximately 10-15 minutes")," for the Energy Gateway to start up and fetch the latest firmware. ")),(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"If you wish to use Wi-Fi")," instead of Ethernet, you can remove the Ethernet cable at this point."))),(0,a.kt)("h2",{id:"pairing-over-bluetooth"},"Pairing over Bluetooth"),(0,a.kt)("admonition",{title:"Info ",type:"caution"},(0,a.kt)("ul",{parentName:"admonition"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"Be sure to be within close range of your Energy Gateway")," to pair over Bluetooth.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"iPhones ",(0,a.kt)("strong",{parentName:"p"},"cannot")," be used for this process as of right now.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"You must have a ",(0,a.kt)("strong",{parentName:"p"},"Solana Wallet")," and a browser plugin (PC/Mac/Linux) like ",(0,a.kt)("strong",{parentName:"p"},"Phantom")," or ",(0,a.kt)("strong",{parentName:"p"},"Solflare")," or an app like Phantom or Solflare (Android) to be able to link your Wallet.")))),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Visit ",(0,a.kt)("a",{parentName:"strong",href:"https://app.srcful.io"},"https://app.srcful.io"))," to start pairing your Energy Gateway.")),(0,a.kt)("ol",{start:2},(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},'Start by clicking the "Select Wallet"')," button to link your Solana Wallet.")),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(4674).Z,width:"1914",height:"1466"})),(0,a.kt)("ol",{start:3},(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Connect")," your Solana Wallet.")),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(410).Z,width:"1115",height:"652"})),(0,a.kt)("ol",{start:4},(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Start the pairing process"),' by clicking the hamburger menu and selecting "Onboard New Gateway".')),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(1674).Z,width:"826",height:"242"})),(0,a.kt)("ol",{start:5},(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Finish the pairing process")," by selecting your Energy Gateway in the Bluetooth menu that pops up in your browser.")),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(2927).Z,width:"1484",height:"1278"})),(0,a.kt)("h2",{id:"configuration"},"Configuration"),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("ul",{parentName:"admonition"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"To find your inverter's IP address, please refer to your router admin page.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"For other information regarding your inverter, please refer to the inverter documentation.")))),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Start by selecting your Wi-Fi network")," in the dropdown menu, and enter your password, and click Submit. You will see it's IP Address when it has successfully connected:")),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(9797).Z,width:"1421",height:"691"})),(0,a.kt)("ol",{start:2},(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Enter your Solana Wallet-Address"),", and click Submit: ")),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(4343).Z,width:"1386",height:"564"})),(0,a.kt)("ol",{start:3},(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Enter your Inverter information")," and click Submit:")),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(5568).Z,width:"1384",height:"583"})),(0,a.kt)("h2",{id:"location"},"Location"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Go to the location tab")," in the side menu.")),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(2576).Z,width:"2212",height:"777"})),(0,a.kt)("ol",{start:2},(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Set your location")," by entering your coordinates or click on the map, then press ",(0,a.kt)("strong",{parentName:"li"},"Sign change"),".")),(0,a.kt)("p",null,(0,a.kt)("img",{src:n(9497).Z,width:"3063",height:"1903"})),(0,a.kt)("ol",{start:3},(0,a.kt)("li",{parentName:"ol"},(0,a.kt)("strong",{parentName:"li"},"Your Energy Gateway")," should now be visible in the ",(0,a.kt)("a",{parentName:"li",href:"https://srcful.io"},(0,a.kt)("strong",{parentName:"a"},"Srcful Explorer")))),(0,a.kt)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,a.kt)("admonition",{title:"Issues",type:"info"},(0,a.kt)("ul",{parentName:"admonition"},(0,a.kt)("li",{parentName:"ul"},"Should you lose connection to your Energy Gateway during the configuration process, you must refresh your browser window, and sometimes restart your Bluetooth."),(0,a.kt)("li",{parentName:"ul"},"If you experience issues with several failed attempts or dropped connection, disconnect any other bluetooth devices that are paired to your computer or Android phone, then try again."))))}m.isMDXComponent=!0},4674:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/step-1-60ac7788b398fcb1f1acaed3be29c396.png"},410:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/step-2-5b5f6740853273164ad03b1e0e8539d5.png"},1674:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/step-3-ece2de0867fe1dd988bfd94e64b1151c.png"},2927:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/step-4-96a226f4e2d8c011b26efe960c23a72a.png"},9797:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/step-5-770ada97349002c5d6e61dc99107a542.png"},4343:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/step-6-256be9cf689a891de885fcc963d021c2.png"},5568:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/step-7-2a463240ddd1a6ab6d398a234c73685a.png"},2576:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/step-8-4c825bd2625093fa93fc15b201ac1e13.png"},9497:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/step-9-0d53ba80b7299cbbca74103f5684d814.png"}}]);