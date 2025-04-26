export default function handler(req, res) {
    if (req.method === 'HEAD') {
        res.status(200).send('OK');
    } else if (req.method === 'POST') {
        console.log('Trelloから受信:', req.body);
        res.status(200).send('OK');
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
