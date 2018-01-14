SkyGameServer.AdminRoom = OBJECT({

	init : (inner, self) => {
		
		let pushKeyDB = SkyGameServer.DB('PushKey');
		
		SkyGameServer.ROOM('Admin', (clientInfo, on, off) => {
			
			let checkIsAdmin = () => {
				return clientInfo !== undefined && clientInfo.roles !== undefined && CHECK_IS_IN({
					array : clientInfo.roles,
					value : SkyGameServer.ROLE.ADMIN
				}) === true;
			};
			
			// 운영자 로그인
			on('auth', (password, ret) => {
				if (password === NODE_CONFIG.SkyGameServer.adminPassword) {
					clientInfo.roles = [SkyGameServer.ROLE.ADMIN];
					ret(password === NODE_CONFIG.SkyGameServer.adminPassword);
				} else {
					ret(false);
				}
			});
			
			// 푸시 메시지 보내기
			on('sendPushMessage', (params) => {
				if (params !== undefined && checkIsAdmin() === true) {
					
					let os = params.os;
					let language = params.language;
					let message = params.message;
					
					if (VALID.notEmpty(os) !== true) {
						os = undefined;
					}
					if (VALID.notEmpty(language) !== true) {
						language = undefined;
					}
					
					if (VALID.notEmpty(message) === true) {
						
						let filter1 = {
							// 90일 이내 수정
							lastUpdateTime : {
								$gt : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
							}
						};
						let filter2 = {
							lastUpdateTime : TO_DELETE,
							
							// 90일 이내 생성
							createTime : {
								$gt : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
							}
						};
						
						if (os === 'android') {
							filter1.androidKey = {
								$ne : TO_DELETE
							};
							filter2.androidKey = {
								$ne : TO_DELETE
							};
						}
						if (os === 'ios') {
							filter1.iosKey = {
								$ne : TO_DELETE
							};
							filter2.iosKey = {
								$ne : TO_DELETE
							};
						}
						
						if (language !== undefined) {
							filter1.language = language;
							filter2.language = language;
						}
						
						pushKeyDB.find({
							filter : {
								$or : [filter1, filter2]
							},
							isFindAll : true
						}, EACH((pushKeyData) => {
							
							if (pushKeyData.androidKey !== undefined) {
								
								UPUSH.ANDROID_PUSH({
									regId : pushKeyData.androidKey,
									data : {
										message : message
									}
								});
							}
							
							if (pushKeyData.iosKey !== undefined) {
								
								UPUSH.IOS_PUSH({
									badge : 1,
									token : pushKeyData.iosKey,
									sound : 'ping.aiff',
									message : message
								});
							}
						}));
					}
				}
			});
		});
	}
});
