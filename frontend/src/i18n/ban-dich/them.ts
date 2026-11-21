import type { BanDich } from './kieu'

/** Bản dịch cho hộp thoại thoát / khởi động lại và cài đặt máy chủ. */
export const banDichThem: BanDich = {
  'Kết nối được tới máy chủ.': ['Connected to the server.', '서버에 연결되었습니다.', 'サーバーに接続できました。', '已成功连接到服务器。'],
  'Không kết nối được. Kiểm tra địa chỉ, Wi-Fi và backend đang chạy.': ['Unable to connect. Check the address, Wi-Fi and that the backend is running.', '연결할 수 없습니다. 주소, Wi-Fi, 백엔드 실행 여부를 확인하세요.', '接続できません。アドレス、Wi-Fi、バックエンドの起動を確認してください。', '无法连接。请检查地址、Wi-Fi 以及后端是否正在运行。'],
  'Máy chủ kết nối': ['Server connection', '연결 서버', '接続サーバー', '连接服务器'],
  'Địa chỉ máy chủ (ví dụ: http://192.168.1.10:8080)': ['Server address (e.g. http://192.168.1.10:8080)', '서버 주소 (예: http://192.168.1.10:8080)', 'サーバーのアドレス（例: http://192.168.1.10:8080）', '服务器地址（例如：http://192.168.1.10:8080）'],
  'Đang kiểm tra…': ['Checking…', '확인 중…', '確認中…', '检查中…'],
  'Kiểm tra kết nối': ['Test connection', '연결 테스트', '接続テスト', '测试连接'],
  'Về mặc định': ['Reset to default', '기본값으로', 'デフォルトに戻す', '恢复默认'],
  'Lưu': ['Save', '저장', '保存', '保存'],
  'Khởi động lại để đổi ngôn ngữ': ['Restart to change language', '언어 변경을 위해 다시 시작', '言語を変更するには再起動が必要です', '重启以更改语言'],
  'Ứng dụng sẽ chuyển sang {0} sau khi khởi động lại. Bạn muốn khởi động lại ngay bây giờ không?': ['The app will switch to {0} after restarting. Restart now?', '다시 시작하면 앱이 {0}(으)로 바뀝니다. 지금 다시 시작할까요?', '再起動すると、アプリは{0}に切り替わります。今すぐ再起動しますか？', '重启后应用将切换为{0}。要现在重启吗？'],
  'Nếu chọn "Để sau", ngôn ngữ mới sẽ được áp dụng ở lần mở ứng dụng tiếp theo.': ['If you choose "Later", the new language will apply the next time you open the app.', '"나중에"를 선택하면 다음에 앱을 열 때 새 언어가 적용됩니다.', '「後で」を選ぶと、次回アプリを開いたときに新しい言語が適用されます。', '若选择“稍后”，新语言将在下次打开应用时生效。'],
  'Khởi động lại ngay': ['Restart now', '지금 다시 시작', '今すぐ再起動', '立即重启'],
  'Để sau': ['Later', '나중에', '後で', '稍后'],
  'Thoát ứng dụng?': ['Exit the app?', '앱을 종료할까요?', 'アプリを終了しますか？', '退出应用？'],
  'Bạn có chắc muốn thoát Finora không?': ['Are you sure you want to exit Finora?', 'Finora를 종료하시겠습니까?', 'Finoraを終了してもよろしいですか？', '确定要退出 Finora 吗？'],
  'Thoát': ['Exit', '종료', '終了', '退出'],
  'Ở lại': ['Stay', '계속 사용', '続ける', '留下'],
  'Ngôn ngữ mới sẽ được áp dụng sau khi khởi động lại ứng dụng.': ['The new language will be applied after restarting the app.', '새 언어는 앱을 다시 시작하면 적용됩니다.', '新しい言語はアプリの再起動後に適用されます。', '新语言将在重启应用后生效。'],
  '{0}{1} tr': ['{0}{1}M', '{0}{1}M', '{0}{1}M', '{0}{1}M'],
}
