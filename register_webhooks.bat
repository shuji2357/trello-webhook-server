@echo off
chcp 65001
setlocal enabledelayedexpansion

:: ログファイル設定
set LOGFILE=webhook_log.txt

:: Trello APIキーとトークン
set API_KEY=c87f9ea4ef97a6d4bf92f25df8ed741c
set TOKEN=ATTA3da08f0ddb6270ebfd32c965b26b1b4e2272a3daa2b0ed1d7220982331d89a9366996CF8
set CALLBACK_URL=https://trello-webhook-server.vercel.app/api/

:: 登録対象のボードUUIDリスト（スペース区切り）
set IDS=67bd310825735bd02f37d536 67bd30a304a812942cd59435 67bd1be17e514228d632677f 67bd364752dd6103ac823635 67bd2d78cd2ec9bc4fade474 67bd23c32f62f84a9e0218b1 67bd367bdad0d0aac72c9115 67bd2df28904e07dd8e96ac7 67bd2488c50aa8e4945c0291 67bd1d308ff8c8a52bf1301f 67bd2eb019d32f54c5aec340 68024bcaebfbcfd0e0b27757 67bd2da8b599e3222d8e38b0

:: ログファイル初期化
echo Webhook登録ログ > %LOGFILE%
echo ============================ >> %LOGFILE%

:: カウント用
set /a COUNT=1

:: ループ開始
for %%I in (%IDS%) do (
    set ID=%%I
    echo.
    echo ---------------------------
    echo 登録中: Board !ID! (No. !COUNT!)
    echo 登録中: Board !ID! (No. !COUNT!) >> %LOGFILE%

    curl -X POST "https://api.trello.com/1/webhooks/?key=%API_KEY%&token=%TOKEN%" ^
    -H "Content-Type: application/json" ^
    -d "{\"description\": \"Webhook for Board !COUNT!\", \"callbackURL\": \"%CALLBACK_URL%\", \"idModel\": \"!ID!\"}" >> %LOGFILE% 2>&1

    if errorlevel 1 (
        echo ❌ 登録失敗: Board !ID!
        echo ❌ 登録失敗: Board !ID! >> %LOGFILE%
    ) else (
        echo ✅ 登録成功: Board !ID!
        echo ✅ 登録成功: Board !ID! >> %LOGFILE%
    )

    set /a COUNT+=1
)

echo.
echo 全てのWebhook登録処理が完了しました。ログは %LOGFILE% をご確認ください。
echo 全てのWebhook登録処理が完了しました。ログは %LOGFILE% をご確認ください。 >> %LOGFILE%
pause
exit
