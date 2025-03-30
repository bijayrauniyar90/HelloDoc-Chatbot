import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";

const App = () => {

  const [chatHistory, setChatHistory] = useState([
    {
    hideInChat: true,
    role: "model", 
    text: companyInfo 
  }]);
  const [showChatbot, setShowChatbot] = useState(false);

  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {

    // Helper function to update chat history
    const updateHistory = (text , isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model",
      text, isError}]);
    }

    // Format Chat History for API request
    history = history.map(({role, text}) => ({role, parts:[{text}]}));

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: history })
    }

    try {

      // Make the API call to get the bot's response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "Something went wrong!");

      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").
      trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.error(error.message, true);
    }
  };

  useEffect(() => {

    // Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);

  return(
    <div className={`container ${showChatbot ? "show-chatbot" : ""}` }>

      <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">

        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">HelloDoc</h2>
          </div>
          <button onClick={() => setShowChatbot(prev => !prev)}
          className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>

          {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) =>(
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default App;

// import { useEffect, useRef, useState } from "react";
// import ChatbotIcon from "./components/ChatbotIcon";
// import ChatForm from "./components/ChatForm";
// import { companyInfo } from "./companyInfo";
// const ChatMessage = ({ chat }) => (
//   <div
//     className={`message ${
//       chat.role === "user"
//         ? "user-message"
//         : chat.isError
//         ? "error-message"
//         : "bot-message"
//     }`}
//   >
//     {chat.role === "model" && !chat.isError && <ChatbotIcon />}
//     <p className="message-text">{chat.text}</p>
//   </div>
// );

// const App = () => {
//   const [chatHistory, setChatHistory] = useState([{
//     hideInChat: true,
//     role: "model",
//     text: companyInfo},
//   ]);
//   const [showChatbot, setShowChatbot] = useState(false);
//   const chatBodyRef = useRef();

//   const generateBotResponse = async (history) => {
//     // Helper function to update chat history
//     const updateHistory = (text, isError = false) => {
//       setChatHistory((prev) => [
//         ...prev.filter((msg) => msg.text !== "Thinking..."),
//         { role: "model", text, isError }]);
//     };

//     // Format chat history for API request
//     const formattedHistory = history.map(({ role, text }) => ({
//       role,
//       parts: [{ text }],
//     }));

//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ contents: formattedHistory }),
//     };

//     try {
//       // Make API call to get bot response
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}&key=${import.meta.env.VITE_API_KEY}`,
//         requestOptions
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData?.error?.message || "Something went wrong!");
//       }

//       // Clean and update chat history with bots response
//       const data = await response.json();
//       const apiResponseText =
//         data?.candidates?.[0]?.content?.parts?.[0]?.text
//           ?.replace(/\*\*(.*?)\*\*/g, "$1")
//           .trim() || "Sorry, I couldn't understand that.";

//       updateHistory(apiResponseText);
//     } catch (error) {
//       console.error("Error fetching bot response:", error);
//       updateHistory(`Error: ${error.message}`, true);
//     }
//   };


//   useEffect(() => {
//     // Auto-scroll to the bottom when chat history updates
//     if (chatBodyRef.current) {
//       chatBodyRef.current.scrollTo({
//         top: chatBodyRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [chatHistory]);

//   return (
//     <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
//       {/* Chatbot Toggle Button */}
//       <button
//         onClick={() => setShowChatbot((prev) => !prev)}
//         id="chatbot-toggler"
//       >
//         <span className="material-symbols-rounded"> mode_comment </span>
//         <span className="material-symbols-rounded"> close </span>
//       </button>
//       <div className="chatbot-popup">

//         {/* Chatbot Header */}
//         <div className="chat-header">
//           <div className="header-info">
//             <ChatbotIcon />
//             <h2 className="logo-text">HelloDoc</h2>
//           </div>
//           <button
//             onClick={() => setShowChatbot((prev) => !prev)}
//             className="material-symbols-rounded"
//           >
//             keyboard_arrow_down
//           </button>
//         </div>

//         {/* Chatbot Body */}
//         <div ref={chatBodyRef} className="chat-body">

//           {/* Initial Bot Message */}
//           <div className="message bot-message">
//             <ChatbotIcon />
//             <p className="message-text">
//               Hey there 👋 <br /> How can I help you today?
//             </p>
//           </div>

//           {/* Render Chat History */}
//           {chatHistory.map((chat, index) => (
//             <ChatMessage key={index} chat={chat} />
//           ))}
//         </div>

//         {/* Chatbot Footer */}
//         <div className="chat-footer">
//           <ChatForm
//             chatHistory={chatHistory}
//             setChatHistory={setChatHistory}
//             generateBotResponse={generateBotResponse}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;