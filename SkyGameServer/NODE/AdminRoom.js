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
					
					pushKeyDB.find({
						isFindAll : true
					}, EACH((pushKeyData) => {
						
						if (pushKeyData.androidKey !== undefined) {
							
							UPUSH.ANDROID_PUSH({
								regId : pushKeyData.androidKey,
								data : {
									message : params.message
								}
							});
						}
						
						if (pushKeyData.iosKey !== undefined) {
							
							UPUSH.IOS_PUSH({
								badge : 1,
								token : pushKeyData.iosKey,
								sound : 'ping.aiff',
								message : params.message
							});
						}
					}));
				}
			});
		});
	}
});
