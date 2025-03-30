// import { useRef } from "react";

// const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse}) => {

//     const inputRef = useRef();

//     const handleFormSubmit = () => {
//         e.preventDefault();
//         const userMessage = inputRef.current.value.trim();
//         if(!userMessage) return;
//         inputRef.current.value = "";

//         // Update chat history with the user's message
//         setChatHistory(history => [...history, {role: "user", text: userMessage}]);

//         // Delay 600ms before showing "Thinking..." and generating response
//         // Add a "Thinking..." placeholder for the bot's response
//         setTimeout(() => { 
//         setChatHistory((history) => [...history, {role: "model", text: "Thinking..."}]);

//         // Call the function to generate the bot's response
//         generateBotResponse([...chatHistory, {role: "user", text: `Using the details provided above, please
//             address this query: ${userMessage}`}]);
//     }, 600);
// }

//     return (
//         <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
//           <input ref={inputRef} type="text" placeholder="Message..."
//           className="message-input" />
//           <button
//           className="material-symbols-rounded">arrow_upward</button>
//         </form>
//     )
// }

// export default ChatForm;

import { useRef, useState } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage || isLoading) return;
    inputRef.current.value = "";

    setIsLoading(true);

    // Combine user and "Thinking..." bot message
    const updatedChatHistory = [
      ...chatHistory,
      { role: "user", text: userMessage },
      { role: "model", text: "Thinking..." },
    ];
    setChatHistory(updatedChatHistory);

    try {
      await generateBotResponse(updatedChatHistory);
    } catch (error) {
      console.error("Error generating bot response:", error);
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text: "Failed to get a response. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
        aria-label="Type your message here"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="material-symbols-rounded"
        aria-label="Send Message"
        disabled={isLoading}
      >
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;