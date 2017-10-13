SkyGameServer.MAIN = METHOD({
	
	run : (addRequestHandler) => {
		
		addRequestHandler((requestInfo, response) => {

			let uri = requestInfo.uri;
			let method = requestInfo.method;
			let params = requestInfo.params;
			
			if (uri === 'rank/save') {
				
				if (method === 'POST') {
					
					if (params.name !== undefined && params.key === SHA256({
						password : params.name,
						key : NODE_CONFIG.SkyGameServer.secureKey
					})) {
						
						SkyGameServer.RankModel.create({
							name : params.name,
							point : params.point
						}, {
							notValid : () => {
								response({
									statusCode : 400
								});
							},
							success : (savedData) => {
								response({
									contentType : 'application/json',
									content : JSON.stringify({
										name : savedData.name,
										point : savedData.point
									})
								});
							}
						});
					}
					
					else {
						response({
							statusCode : 400
						});
					}
				}
				
				else {
					response({
						statusCode : 404
					});
				}
				
				return false;
			}
			
			if (uri === 'rank/list') {
				
				SkyGameServer.RankModel.find({
					count : params.count
				}, (savedDataSet) => {
					response({
						contentType : 'application/json',
						content : JSON.stringify({
							list : savedDataSet
						})
					});
				});
				
				return false;
			}
		});
	}
});
