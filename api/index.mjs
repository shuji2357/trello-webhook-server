import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export default async function handler(req, res) {
    if (req.method === 'HEAD') {
        return res.status(200).send('OK');
    } else if (req.method === 'POST') {
        const body = req.body;
        const cardName = body?.action?.data?.card?.name || "カード名不明";
        const boardName = body?.action?.data?.board?.name || "ボード名不明";

        const message = {
            text: `📢 Trello通知\nボード「${boardName}」に新しいカード「${cardName}」が作成されました！`
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

    res.status(405).send('Method Not Allowed');
}
