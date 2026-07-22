const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("CharrobAI server is online! 🤖");
});

app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                error: "Message is missing"
            });
        }

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.OPENAI_API_KEY}`
                },

                body: JSON.stringify({
                    model: "gpt-4o-mini",

                    instructions:
                        "You are CharrobAI, a friendly AI assistant inside a Roblox game. Answer in the same language as the player.",

                    input: message
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.log(data);

            return res.status(500).json({
                error: "OpenAI API error"
            });
        }

        res.json({
            reply: data.output_text ||
                "Sorry, I couldn't answer that."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Server error"
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `CharrobAI server running on port ${PORT}`
    );
});
