import express from 'express';
const app = express();
app.get("/", (req, res) => {
    res.status(200).json({
        msg: "get started"
    });
});
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
});
