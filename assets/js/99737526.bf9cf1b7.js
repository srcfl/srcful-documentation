"use strict";(self.webpackChunksrcful_documentation=self.webpackChunksrcful_documentation||[]).push([[2388],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>y});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),s=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=s(r),f=a,y=c["".concat(u,".").concat(f)]||c[f]||d[f]||o;return r?n.createElement(y,i(i({ref:t},p),{},{components:r})):n.createElement(y,i({ref:t},p))}));function y(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=f;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[c]="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},874:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>s});var n=r(7462),a=(r(7294),r(3905));const o={sidebar_position:1,slug:"/developer/"},i="API Documentation",l={unversionedId:"developer/API",id:"developer/API",title:"API Documentation",description:"Overview",source:"@site/docs/developer/API.md",sourceDirName:"developer",slug:"/developer/",permalink:"/developer/",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,slug:"/developer/"},sidebar:"tutorialSidebar",previous:{title:"Blockchain and Crypto",permalink:"/sustainability/blockchain"},next:{title:"Design manual and press",permalink:"/developer/design-manual"}},u={},s=[{value:"Overview",id:"overview",level:2},{value:"API Playground",id:"api-playground",level:3},{value:"Authentication",id:"authentication",level:2},{value:"Querying the API",id:"querying-the-api",level:2},{value:"Example Query: Fetching Production Data",id:"example-query-fetching-production-data",level:3}],p={toc:s},c="wrapper";function d(e){let{components:t,...r}=e;return(0,a.kt)(c,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"api-documentation"},"API Documentation"),(0,a.kt)("h2",{id:"overview"},"Overview"),(0,a.kt)("p",null,"The Sourceful GraphQL API provides access to production data from various energy assets. It is designed to be flexible, allowing users to query the data in various resolutions and time frames. This documentation explains how to interact with the API using GraphQL."),(0,a.kt)("h3",{id:"api-playground"},"API Playground"),(0,a.kt)("p",null,"For testing and experimenting with queries, you can visit the ",(0,a.kt)("a",{parentName:"p",href:"https://api.srcful.dev/playground"},"API Playground"),". This tool allows you to execute queries interactively and inspect results, making it easier to translate queries into your application code."),(0,a.kt)("h2",{id:"authentication"},"Authentication"),(0,a.kt)("p",null,"Currently, authentication is not required for basic access, but we plan to add authentication mechanisms in future iterations."),(0,a.kt)("h2",{id:"querying-the-api"},"Querying the API"),(0,a.kt)("p",null,"The API uses GraphQL, a powerful query language for APIs that allows clients to specify exactly what data they need."),(0,a.kt)("h3",{id:"example-query-fetching-production-data"},"Example Query: Fetching Production Data"),(0,a.kt)("p",null,"Below is an example of how to fetch production data using Python with the ",(0,a.kt)("inlineCode",{parentName:"p"},"gql")," library. The query retrieves power data for a given asset over a specific time range."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'from gql import gql, Client\nfrom gql.transport.requests import RequestsHTTPTransport\n\n# Define the GraphQL query as a string\nquery = gql("""\nquery get_some_data {\n  proofOfSource(id:"01234bdcfdad2fa4ee") {\n    histogram(start:"2024-10-01T00:00:00.000Z", stop: "2024-10-07T00:00:00.000Z", resolution:"1h") {\n      when\n      power\n    }\n  }\n}\n""")\n\n# Set up the GraphQL client\ntransport = RequestsHTTPTransport(url=\'https://api.srcful.dev/\')\nclient = Client(transport=transport, fetch_schema_from_transport=True)\n\n# Execute the query\ntry:\n    result = client.execute(query)\n    print(result)\nexcept Exception as e:\n    print(f"An error occurred: {e}")\n')))}d.isMDXComponent=!0}}]);