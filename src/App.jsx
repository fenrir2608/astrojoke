import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Smile, Sun, Moon } from "lucide-react";
import guruji from "./assets/guruji.png";

const IndianMotif = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-5"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z"
      fill="currentColor"
    />
    <path
      d="M50 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"
      fill="currentColor"
    />
  </svg>
);

const ChatMessage = ({ isUser, message, time, isDarkMode }) => (
  <div
    className={`flex items-start gap-4 text-sm ${isUser ? "justify-end" : ""}`}
  >
    {!isUser && (
      <div className="flex-shrink-0 w-14 h-14">
        <img
          src={guruji}
          alt="Guruji"
          className="rounded-full w-full h-full object-cover"
        />
      </div>
    )}
    <div className="grid gap-1 items-start">
      <div
        className={`flex items-center gap-2 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        <div className="font-bold">{isUser ? "You" : "Guruji"}</div>
        <div
          className={`text-sm ${
            isDarkMode ? "text-yellow-400" : "text-yellow-800"
          }`}
        >
          {time}
        </div>
      </div>
      <div
        className={`px-4 py-2 rounded-2xl ${
          isUser
            ? isDarkMode
              ? "bg-yellow-700 text-yellow-100"
              : "bg-yellow-200 text-yellow-900"
            : isDarkMode
            ? "bg-gray-700 text-yellow-100"
            : "bg-yellow-600 text-yellow-100"
        }`}
      >
        <p>{message}</p>
      </div>
    </div>
    {isUser && (
      <div
        className={`flex-shrink-0 rounded-full w-14 h-14 ${
          isDarkMode ? "bg-yellow-700" : "bg-yellow-200"
        } text-3xl flex items-center justify-center`}
      >
        👤
      </div>
    )}
  </div>
);

const EmojiBar = ({ onEmojiSelect }) => {
  const emojis = ["😊", "😂", "🙏", "❤️", "🙌", "✨", "🌟", "🎉"];
  return (
    <div className="flex space-x-2">
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onEmojiSelect(emoji)}
          className="hover:bg-yellow-200 rounded-full p-1 transition-colors duration-200"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "" || isTyping) return;

    const newUserMessage = {
      isUser: true,
      message: inputText,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Keep the responses extremely straightforward and natural. Always provide exact answers without any metaphors or vague statements. For example, if asked, "Will my ex come back?" respond directly with, "Yes, she will return in 2 months; she needs time." If asked about marriage, say something like, "You will get married on November 22nd next year."

Use simple, easy-to-understand language, and maintain a conversational natural tone. After every 3rd or 4th response, ask a personal question to create an engaging conversation, like, "Are you taking care of yourself?" or "How have you been feeling lately?"

Include Indian cultural references and occasional Hindi phrases, such as "Dhyaan rakhna" (take care) or "Aashirwad" (blessings). Ensure all responses are positive and uplifting, offering clear guidance. Remember, you are a friendly person providing advice, not a bot or AI. Don't use special characters. If you're unsure about a response, ask yourself, Would a wise Indian astrologer say this?. Don't be Shakespeare. Keep it casual.

                    input: ${inputText}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 2,
            topK: 64,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        },
        {
          params: { key: "AIzaSyDPsCwZpQzE8W1qCb2Y0KG3OM4aPS73lKw" },
          headers: { "Content-Type": "application/json" },
        }
      );

      const botMessage = response.data.candidates[0].content.parts[0].text;
      const newBotMessage = {
        isUser: false,
        message: botMessage,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessages = [
        "Mujhe samajh nahi aaya. Kya aap thoda aur spasht kar sakte hain?",
        "Ye thoda sa samajh mein nahi aaya. Kripya mujhe aur detail mein batayein.",
        "Mujhe ye samajhne mein thodi dikkat ho rahi hai. Kya aap dobara bata sakte hain?",
        "Kya aap isko thoda aur samjha sakte hain? Main madad karna chahta hoon.",
        "Mujhe aapka sawaal samajh nahi aaya. Kya aap isse kuch aur badal sakte hain?",
        "Mujhe yeh samajhne mein thoda waqt lagega. Kya aap kuch aur share kar sakte hain?",
        "Yeh kuch samajh nahi aaya. Kya aap mujhe aur information de sakte hain?",
      ];
      const randomErrorMessage =
        errorMessages[Math.floor(Math.random() * errorMessages.length)];
      const errorMessage = {
        isUser: false,
        message: randomErrorMessage,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode
          ? "bg-gray-900 text-yellow-100"
          : "bg-yellow-100 text-yellow-900"
      } relative overflow-hidden`}
    >
      <IndianMotif />
      <header
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-yellow-500"
        } py-4 px-6 shadow-md z-10`}
      >
        <h1
          className={`text-2xl font-bold ${
            isDarkMode ? "text-yellow-100" : "text-yellow-900"
          }`}
        >
          AstroJoke
        </h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} {...msg} isDarkMode={isDarkMode} />
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 ${
                isDarkMode ? "bg-yellow-400" : "bg-yellow-600"
              } rounded-full animate-bounce`}
            ></div>
            <div
              className={`w-3 h-3 ${
                isDarkMode ? "bg-yellow-400" : "bg-yellow-600"
              } rounded-full animate-bounce`}
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className={`w-3 h-3 ${
                isDarkMode ? "bg-yellow-400" : "bg-yellow-600"
              } rounded-full animate-bounce`}
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-yellow-500"
        } py-4 px-6 shadow-md z-10`}
      >
        <form
          onSubmit={handleSendMessage}
          className="flex items-center w-full space-x-2"
        >
          <button
            type="button"
            onClick={() => setShowEmojiBar(!showEmojiBar)}
            className={`${
              isDarkMode
                ? "text-yellow-100 hover:text-yellow-200"
                : "text-yellow-900 hover:text-yellow-700"
            } focus:outline-none`}
          >
            <Smile size={24} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className={`flex-1 ${
              isDarkMode
                ? "bg-gray-700 text-yellow-100"
                : "bg-yellow-100 text-yellow-900"
            } border-none rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-600`}
            disabled={isTyping}
            ref={inputRef}
          />
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`${
              isDarkMode
                ? "text-yellow-100 hover:text-yellow-200"
                : "text-yellow-900 hover:text-yellow-700"
            } focus:outline-none`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            type="submit"
            className={`${
              isDarkMode
                ? "bg-yellow-600 text-gray-900"
                : "bg-yellow-600 text-yellow-100"
            } rounded-full p-2 font-bold hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            disabled={isTyping}
          >
            <Send size={24} />
          </button>
        </form>
        {showEmojiBar && <EmojiBar onEmojiSelect={handleEmojiSelect} />}
      </footer>
    </div>
  );
}