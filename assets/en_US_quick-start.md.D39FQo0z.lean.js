import{u as m,a as _,b as I,c as B,I as P}from"./chunks/theme.CohBgODB.js";import{T as W}from"./chunks/TransactionBlock.Use7N_aT.js";import{r as b,u as k,x as i,K as n,z as F,A as e,y as t,F as d,j as a,J as j,ao as l,a2 as E,q as p}from"./chunks/framework.B-vsaDWh.js";const V=l("",19),N=l("",4),M=l("",2),U=l("",4),O=l("",5),Q=l("",3),R=l("",4),X=n("p",null,"objects:",-1),z=l("",3),$=n("p",null,"The supported actions are：",-1),J=n("ul",null,[n("li",null,"signAndExecuteTransactionBlock"),n("li",null,"signTransactionBlock"),n("li",null,"signPersonalMessage"),n("li",null,"getExactlyCoinAmount")],-1),L=n("p",null,"More will be supported in the future",-1),ss=JSON.parse('{"title":"quick start","description":"","frontmatter":{},"headers":[],"relativePath":"en_US/quick-start.md","filePath":"en_US/quick-start.md"}'),H={name:"en_US/quick-start.md"},is=Object.assign(H,{setup(K){const C=m();_();const{isConnected:c}=m(),{loadObjects:D,objects:v}=_(),{signAndExecuteTransactionBlock:f,getExactlyCoinAmount:q}=I(),o=b(),g=b(5);async function T(){const r=new W;try{const s=await q({txb:r,coinType:B.COIN_SUI,amt:g.value*B.MIST_PER_SUI});r.transferObjects([s],"0xcc05ae5fe806c7df585f5b4bd626a33d14045f2e123e794b16fcfd7949e7f3ef"),await f(r)}catch(s){if(s instanceof P){alert("Insufficient balance");return}throw s}}return(r,s)=>{const S=E("n-connect-button"),y=E("n-button"),u=E("n-text"),w=E("n-input"),A=E("n-flex"),x=E("n-input-number");return p(),k("div",null,[V,i(S),N,n("p",null,"isConnected: "+F(e(C).isConnected),1),M,i(y,{onClick:s[0]||(s[0]=h=>console.log(e(C).isConnected.value))},{default:t(()=>[a("click to show isConnected")]),_:1}),U,i(u,{type:"error",strong:""},{default:t(()=>[a("! ! Notice! ! If you use these attributes in a template, it is best to deconstruct them, otherwise unexpected effects may occur.")]),_:1}),O,e(c)?(p(),k(d,{key:0},[a(" suiBalance: "+F(r.suiBalance)+" MIST ",1)],64)):(p(),k(d,{key:1},[a(" Connect to show suiBalance ")],64)),Q,i(u,{type:"error",strong:""},{default:t(()=>[a("! ! Notice! ! The current loading of assets is a one-time operation. If you think your assets have changed, you should call `loadXxx` again to update your assets. In the future, we will consider adding a listener to monitor asset changes in real time.")]),_:1}),R,e(c)?(p(),k(d,{key:2},[i(A,null,{default:t(()=>[i(w,{value:o.value,"onUpdate:value":s[1]||(s[1]=h=>o.value=h)},null,8,["value"]),i(y,{onClick:s[2]||(s[2]=h=>o.value&&e(D)(o.value))},{default:t(()=>[a("Load")]),_:1})]),_:1}),X,n("p",null,F(e(v)),1)],64)):(p(),k(d,{key:3},[a(" connect wallet to show objects ")],64)),z,e(c)?(p(),j(A,{key:4},{default:t(()=>[i(x,{value:g.value,"onUpdate:value":s[3]||(s[3]=h=>g.value=h)},null,8,["value"]),i(y,{onClick:s[4]||(s[4]=h=>T())},{default:t(()=>[a("sponsorMe!!")]),_:1})]),_:1})):(p(),k(d,{key:5},[a(" connect wallet to show action ")],64)),$,J,L,i(u,{type:"error",strong:""},{default:t(()=>[a("! ! Notice! ! Before using the corresponding walletFeatures, you need to set the requiredFeatures in SuiueProvider's config in advance. otherwise an error may be reported!")]),_:1})])}}});export{ss as __pageData,is as default};