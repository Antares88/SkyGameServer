SkyGameServer.RankModel=OBJECT({preset:()=>{return SkyGameServer.MODEL},params:()=>{let e={name:{notEmpty:!0,size:{max:255}},point:{notEmpty:!0,integer:!0}};return{name:"Rank",methodConfig:{create:{valid:VALID(e)},update:!1,remove:!1}}}});SkyGameServer.MAIN=METHOD({run:e=>{e((e,n)=>{let o=e.uri,t=e.method,r=e.params;return"rank/save"===o?("POST"===t?void 0!==r.name&&r.key===SHA256({password:r.name,key:NODE_CONFIG.SkyGameServer.secureKey})?SkyGameServer.RankModel.create({name:r.name,point:r.point},{notValid:()=>{n({statusCode:400,headers:{"Access-Control-Allow-Origin":"*"}})},success:e=>{SkyGameServer.RankModel.count({filter:{point:{$gt:e.point}}},e=>{n({contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"},content:e+1})})}}):n({statusCode:400,headers:{"Access-Control-Allow-Origin":"*"}}):n({statusCode:404,headers:{"Access-Control-Allow-Origin":"*"}}),!1):"rank/list"===o?(SkyGameServer.RankModel.find({sort:{point:-1},count:void 0===r.count?100:r.count},e=>{n({contentType:"application/json",headers:{"Access-Control-Allow-Origin":"*"},content:JSON.stringify({list:e})})}),!1):void 0})}});