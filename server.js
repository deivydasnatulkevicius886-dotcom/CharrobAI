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

        console.log("Received message:", message);

        if (!message) {
            return res.status(400).json({
                error: "Message is missing"
            });
        }

        if (!process.env.OPENAI_API_KEY) {

            console.error("OPENAI_API_KEY is missing!");

            return res.status(500).json({
                error: "OPENAI_API_KEY is missing on Render"
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
                        "You are CharrobAI, a friendly AI assistant inside a Roblox game. Always answer in the same language as the player.",

                    input: message

                })

            }
        );


        const data = await response.json();

        console.log(
            "OpenAI Status:",
            response.status
        );

        console.log(
            "OpenAI Response:",
            JSON.stringify(data)
        );


        if (!response.ok) {

            return res.status(500).json({

                error:
                    data.error?.message
                    || "OpenAI API request failed"

            });

        }


        const answer =
            data.output_text
            || "Sorry, I couldn't answer that.";


        res.json({

            reply: answer

        });


    } catch (error) {

        console.error(
            "CHARROBAI SERVER ERROR:",
            error
        );

        res.status(500).json({

            error:
                error.message
                || "Unknown server error"

        });

    }

});


app.listen(PORT, () => {

    console.log(
        `CharrobAI server running on port ${PORT}`
    );

});
