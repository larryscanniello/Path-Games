import { useState } from "react";
import api from "../api";

export default function Feedback(){
      const [feedback, setFeedback] = useState("");
      const [submitted, setSubmitted] = useState(false);
      const [error,setError] = useState('')
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (feedback.trim() === "") return;
    
        try {
          await api.post("feedback/", { feedback });
          setSubmitted(true);
          setFeedback("");
        } catch (error) {
          console.error("Feedback submit failed:", error);
        }
      };
    
      return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Hi! Thanks for taking the time to check out my project.
            If you have any thoughts or suggestions, I'd love to hear them.
          </h2>
          {submitted ? (
            <p className="text-green-400">Thank you for your feedback!</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback((prev)=>{
                    const value = e.target.value; 
                    if(value.length<3200){
                    return value;
                    }else{
                        setError("Feedback can be at most 3200 characters.")
                        return prev
                    }})}
                placeholder="Your feedback here."
                className="w-full h-32 p-3 rounded-lg border border-gray-600 bg-gray-700 text-white"
              />
              <button
                type="submit"
                className="mt-4 px-4 py-2 hover:bg-blue-200 bg-blue-300 rounded-3xl text-black font-bold"
              >
                Submit
              </button>
              <div className="text-red-500 py-2">{error}</div>
            </form>
          )}
        </div>
      );
    }
