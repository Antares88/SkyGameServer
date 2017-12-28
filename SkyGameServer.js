require(process.env.UPPERCASE_PATH + '/LOAD.js');

BOOT({
	CONFIG : {
		defaultBoxName : 'SkyGameServer',
		
		isDevMode : true,
		webServerPort : 8113
	},
	
	NODE_CONFIG : {
		// 테스트 목적이기 때문에 CPU 클러스터링 기능을 사용하지 않습니다.
		isNotUsingCPUClustering : true,
		
		dbName : 'SkyGameServer-test',
		
		SkyGameServer : {
			adminPassword : 'test123',
			secureKey : 'test123'
		},
		
		// 결제 검증 관련 설정
		UIAP : {
			GooglePlay : {
				clientEmail : '~~~@~~~.iam.gserviceaccount.com',
				privateKey : '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
				appPackageName : 'com.example.App'
			}
		},

		// 푸시 관련 설정
		UPUSH : {
			Android : {
				serverKey : '~~~'
			},
			IOS : {
				certFilePath : './apn/cert.pem',
				keyFilePath : './apn/key.pem',
				password : 'test123'
			}
		}
	}
});
