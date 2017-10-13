# SkyGameServer
랭킹 저장, 결제 검증 등 게임을 개발하기 위해 필요한 여러가지 서버 기능들을 포함하고 있는 BOX입니다.

## 설치하기
프로젝트의 `DEPENDENCY` 파일에 `Hanul/SkyGameServer`를 추가합니다.

## 설정
```
BOOT({
	NODE_CONFIG : {
		SkyGameServer : {
			secureKey : '{{보안 키}}'
		}
	}
});
```

## `rank/save`
랭킹을 저장합니다. `POST` 방식으로만 저장할 수 있습니다. 파라미터 목록은 다음과 같습니다.
- `name` 랭킹의 이름
- `point` 저장할 점수
- `key` [`SHA256({password: name, key: secureKey})`](https://github.com/Hanul/UPPERCASE/blob/master/DOC/GUIDE/UPPERCASE-CORE-COMMON.md#sha256password-key)으로 암호화 된 문자열

## `rank/list?count={{가져올 개수}}`
랭킹 목록을 가져옵니다. `{{가져올 개수}}`를 입력하여 몇 개를 가져올지 지정합니다. 최대 1000개를 가져올 수 있습니다.

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)