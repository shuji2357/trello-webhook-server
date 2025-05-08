import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const SLACK_WEBHOOK_URL2 = process.env.SLACK_WEBHOOK_URL2;

export default async function handler(req, res) {
    if (req.method === 'HEAD') {
        return res.status(200).send('OK');
    } else if (req.method === 'POST') {
        const body = req.body;
        const eventType = body?.action?.type;

        // カード追加時の通知
        if (eventType === 'createCard') {
            const cardName = body?.action?.data?.card?.name || "カード名不明";
            const boardName = body?.action?.data?.board?.name || "ボード名不明";
            const memberFullName = body?.action?.memberCreator?.fullName || "ユーザー不明";

            const message = {
                text: `📢 Trello通知\n👤 *${memberFullName}* さんが、ボード「${boardName}」に新しいカード「${cardName}」を作成しました。`
            };

            try {
                await axios.post(SLACK_WEBHOOK_URL, message);
                console.log("Slack通知成功:", message.text);
                return res.status(200).send('OK');
            } catch (error) {
                console.error("Slack通知失敗:", error);
                return res.status(500).send('Slack通知失敗');
            }
        }

        // カードが「完了チェック」されたときの通知
        if (
            eventType === 'updateCard' &&
            body?.action?.data?.card?.dueComplete === true &&
            body?.action?.data?.old?.dueComplete === false
        ) {
            const cardName = body?.action?.data?.card?.name || "カード名不明";
            const boardName = body?.action?.data?.board?.name || "ボード名不明";
            const memberFullName = body?.action?.memberCreator?.fullName || "ユーザー不明";

            const message = {
                text: `✅ Trello通知\n👤 *${memberFullName}* さんが、ボード「${boardName}」のカード「${cardName}」を *完了済み* にしました（期限チェック）。`
            };

            try {
                await axios.post(SLACK_WEBHOOK_URL2, message);
                console.log("完了通知Slack送信成功:", message.text);
                return res.status(200).send('OK');
            } catch (error) {
                console.error("完了通知Slack送信失敗:", error);
                return res.status(500).send('完了通知Slack送信失敗');
            }
        }

        // 無視するイベント
        console.log(`無視するイベント: ${eventType}`);
        return res.status(200).send('OK');
    }

    res.status(405).send('Method Not Allowed');
}
