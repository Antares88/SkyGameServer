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
			secureKey : 'test123'
		}
	}
});
