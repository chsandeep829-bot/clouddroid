const json=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
export async function onRequest({env}){
 const base=(env.ANDROID_HOST_URL||"").replace(/\/$/,"");const token=env.ANDROID_HOST_TOKEN;
 if(!base||!token)return json({ok:true,service:"CloudDroid API",device:{status:"Not configured",message:"Add ANDROID_HOST_URL and ANDROID_HOST_TOKEN after provisioning a real Android gateway.",androidVersion:null,uptime:null,resources:null,gameStatus:"Not connected"},capabilities:{startStop:false,screenStreaming:false,touchInput:false}});
 try{
  const r=await fetch(base+"/api/v1/status",{headers:{Authorization:"Bearer "+token,Accept:"application/json"},signal:AbortSignal.timeout(8000)});
  if(!r.ok)throw new Error("Host status request failed");const h=await r.json();
  return json({ok:true,service:"CloudDroid API",device:{status:str(h.status,"Unknown"),message:str(h.message,"Connected to Android host."),androidVersion:str(h.androidVersion,null),uptime:str(h.uptime,null),resources:str(h.resources,null),gameStatus:str(h.gameStatus,"Unknown")},capabilities:{startStop:true,screenStreaming:false,touchInput:false}});
 }catch{return json({ok:false,service:"CloudDroid API",device:{status:"Host unreachable",message:"Check the Android gateway URL, token, TLS and host availability.",androidVersion:null,uptime:null,resources:null,gameStatus:"Unknown"},capabilities:{startStop:false,screenStreaming:false,touchInput:false}},503)}
}
function str(v,fallback){return typeof v==="string"?v:fallback}
