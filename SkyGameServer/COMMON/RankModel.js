SkyGameServer.RankModel = OBJECT({
	
	preset : () => {
		return SkyGameServer.MODEL;
	},
	
	params : () => {

		let validDataSet = {
			
			name : {
				notEmpty : true,
				size : {
					max : 255
				}
			},
			
			point : {
				notEmpty : true,
				real : true
			}
		};
		
		return {
			name : 'Rank',
			methodConfig : {
				create : {
					valid : VALID(validDataSet)
				},
				update : false,
				remove : false
			}
		};
	}
});
