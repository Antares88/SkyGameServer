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
									statusCode : 400,
									headers : {
										'Access-Control-Allow-Origin' : '*'
									}
								});
							},
							success : (savedData) => {
								
								SkyGameServer.RankModel.count({
									filter : {
										point : {
											$gt : savedData.point
										}
									}
								}, (count) => {
									
									response({
										contentType : 'application/json',
										headers : {
											'Access-Control-Allow-Origin' : '*'
										},
										content : count + 1
									});
								});
							}
						});
					}
					
					else {
						response({
							statusCode : 400,
							headers : {
								'Access-Control-Allow-Origin' : '*'
							}
						});
					}
				}
				
				else {
					response({
						statusCode : 404,
						headers : {
							'Access-Control-Allow-Origin' : '*'
						}
					});
				}
				
				return false;
			}
			
			if (uri === 'rank/list') {
				
				SkyGameServer.RankModel.find({
					count : params.count === undefined ? 100 : params.count
				}, (savedDataSet) => {
					response({
						contentType : 'application/json',
						headers : {
							'Access-Control-Allow-Origin' : '*'
						},
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
