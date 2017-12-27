SkyGameServer.MAIN = METHOD({
	
	run : (addRequestHandler) => {
		
		let invalidPurchaseLogDB = SkyGameServer.LOG_DB('invalidPurchaseLogDB');
		let validPurchaseLogDB = SkyGameServer.LOG_DB('validPurchaseLogDB');
		
		let pushKeyDB = SkyGameServer.DB('PushKey');
		
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
					sort : {
						point : -1
					},
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
			
			if (uri === 'validatepurchase/android') {
				
				let productId = params.productId;
				let purchaseToken = params.purchaseToken;
				
				if (productId !== undefined && purchaseToken !== undefined) {
					
					UIAP.GOOGLE_PLAY_PURCHASE_VALIDATE({
						productId : productId,
						purchaseToken : purchaseToken
					}, (isValid) => {
						
						// 불법 결제면 로그 남기기
						if (isValid !== true) {
							invalidPurchaseLogDB.log({
								productId : productId,
								purchaseToken : purchaseToken
							});
						}
						
						else {
							validPurchaseLogDB.log({
								productId : productId,
								purchaseToken : purchaseToken
							});
						}
						
						response({
							contentType : 'application/json',
							headers : {
								'Access-Control-Allow-Origin' : '*'
							},
							content : JSON.stringify({
								productId : productId,
								isValid : isValid
							})
						});
					});
				}
				
				return false;
			}
			
			if (uri === 'validatepurchase/ios') {
				
				let productId = params.productId;
				let purchaseReceipt = params.purchaseReceipt;
				
				if (productId !== undefined && purchaseReceipt !== undefined) {
					
					UIAP.APP_STORE_PURCHASE_VALIDATE({
						productId : productId,
						receipt : purchaseReceipt
					}, (isValid) => {
						
						// 불법 결제면 로그 남기기
						if (isValid !== true) {
							invalidPurchaseLogDB.log({
								productId : productId,
								purchaseReceipt : purchaseReceipt
							});
						}
						
						else {
							validPurchaseLogDB.log({
								productId : productId,
								purchaseReceipt : purchaseReceipt
							});
						}
						
						response({
							contentType : 'application/json',
							headers : {
								'Access-Control-Allow-Origin' : '*'
							},
							content : JSON.stringify({
								productId : productId,
								isValid : isValid
							})
						});
					});
				}
				
				return false;
			}
			
			if (uri === 'savepushkey/android') {
				
				let pushKey = params.pushKey;
				
				if (pushKey !== undefined) {
					
					pushKeyDB.checkExists({
						filter : {
							androidKey : pushKey
						}
					}, (exists) => {
						if (exists !== true) {
							
							pushKeyDB.create({
								androidKey : pushKey
							}, (savedData) => {
								
								response({
									content : JSON.stringify(savedData),
									contentType : 'application/json',
									headers : {
										'Access-Control-Allow-Origin' : '*'
									}
								});
							});
						}
					});
				}
				
				return false;
			}
			
			if (uri === 'savepushkey/ios') {
				
				let pushKey = params.pushKey;
				
				if (pushKey !== undefined) {
					
					pushKeyDB.checkExists({
						filter : {
							iosKey : pushKey
						}
					}, (exists) => {
						if (exists !== true) {
							
							pushKeyDB.create({
								iosKey : pushKey
							}, (savedData) => {
								
								response({
									content : JSON.stringify(savedData),
									contentType : 'application/json',
									headers : {
										'Access-Control-Allow-Origin' : '*'
									}
								});
							});
						}
					});
				}
				
				return false;
			}
		});
	}
});
