const json=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const allowed=new Set(["start","stop","restart"]);
export async function onRequestPost({request,env}){
  const configured=env.CLOUDDROID_ACCESS_KEY;
  const host=(env.ANDROID_HOST_URL||"").replace(/\/$/,"");
  const token=env.ANDROID_HOST_TOKEN;
  if(!configured||!host||!token)return json({error:"Host or access key is not configured."},503);
  const supplied=request.headers.get("X-CloudDroid-Key")||"";
  if(supplied.length!==configured.length||!constantTimeEqual(supplied,configured))return json({error:"Unauthorized."},401);
  let body;try{body=await request.json()}catch{return json({error:"Invalid JSON."},400)}
  if(!body||!allowed.has(body.action))return json({error:"Unsupported action."},400);
  try{
    const upstream=await fetch(host+"/api/v1/device/"+body.action,{method:"POST",headers:{Authorization:"Bearer "+token,Accept:"application/json"},signal:AbortSignal.timeout(10000)});
    const result=await upstream.json().catch(()=>({}));
    if(!upstream.ok)return json({error:typeof result.error==="string"?result.error:"Android host rejected the command."},upstream.status);
    return json({ok:true,message:typeof result.message==="string"?result.message:body.action+" command accepted."});
  }catch{return json({error:"Android host is unreachable."},502)}
}
function constantTimeEqual(a,b){let diff=a.length^b.length;const n=Math.max(a.length,b.length);for(let i=0;i<n;i++)diff|=(a.charCodeAt(i%a.length)||0)^(b.charCodeAt(i%b.length)||0);return diff===0}
