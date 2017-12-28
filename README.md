# SkyGameServer
랭킹 저장, 결제 검증 등 게임을 개발하기 위해 필요한 여러가지 서버 기능들을 포함하고 있는 BOX입니다.

## 설치하기
프로젝트의 `DEPENDENCY` 파일에 `Hanul/SkyGameServer`를 추가합니다.

## 설정
```
BOOT({
	NODE_CONFIG : {
	
		dbName : '{{DB 이름}}',
		
		SkyGameServer : {
			secureKey : '{{보안 키}}',
			adminPassword : '{{관리자 비밀번호}}'
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
```

* [구글 플레이 결제 검증 기능 사용 전 준비사항](https://github.com/Hanul/UIAP#%EC%82%AC%EC%9A%A9-%EC%A0%84-%EC%A4%80%EB%B9%84%EC%82%AC%ED%95%AD)
* [푸시 기능 사용 전 준비사항](https://github.com/Hanul/UPUSH#%EC%82%AC%EC%9A%A9-%EC%A0%84-%EC%A4%80%EB%B9%84%EC%82%AC%ED%95%AD)

## `rank/save`
랭킹을 저장합니다. `POST` 방식으로만 저장할 수 있습니다. 파라미터 목록은 다음과 같습니다.
- `name` 랭킹의 이름
- `point` 저장할 점수
- `key` [`SHA256({password: name, key: secureKey})`](https://github.com/Hanul/UPPERCASE/blob/master/DOC/GUIDE/UPPERCASE-CORE-COMMON.md#sha256password-key)으로 암호화 된 문자열

## `rank/list?count={{가져올 개수}}`
랭킹 목록을 가져옵니다. `{{가져올 개수}}`를 입력하여 몇 개를 가져올지 지정합니다. 최대 1000개를 가져올 수 있습니다.

## `validatepurchase/android`
Android 결제를 검증합니다. `POST` 방식으로만 검증할 수 있습니다. 파라미터 목록은 다음과 같습니다.
- `productId` 상품의 이름
- `purchaseToken` 결제 토큰 문자열

## `validatepurchase/ios`
iOS 결제를 검증합니다. `POST` 방식으로만 검증할 수 있습니다. 파라미터 목록은 다음과 같습니다.
- `productId` 상품의 이름
- `purchaseReceipt` 결제 영수증 문자열

## `savepushkey/android`
Android 푸시 키를 저장합니다. `POST` 방식으로만 검증할 수 있습니다. 파라미터 목록은 다음과 같습니다.
- `pushKey` 푸시 키

## `savepushkey/ios`
iOS 푸시 키를 저장합니다. `POST` 방식으로만 검증할 수 있습니다. 파라미터 목록은 다음과 같습니다.
- `pushKey` 푸시 키

## `SkyGameServer/admin`
푸시메시지를 보내는 등 여러가지 기능을 사용할 수 있는 관리자 페이지에 접속합니다.

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)