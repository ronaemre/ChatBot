import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [sessionId, setSessionId] = useState('');
    const [questions, setQuestions] = useState([]); 
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        const sessionId = Math.random().toString(36).substring(7);
        setSessionId(sessionId);
        fetchInitialQuestion();
    }, []);

    const fetchInitialQuestion = async () => {
        try {
            const response = await axios.post('aaaaaaa', {
                model: "gpt-3.5-turbo", 
                messages: [{ role: "user", content: "Generate a fun question about cats." }],
                max_tokens: 60,
                temperature: 0.5,
            }, {
                headers: {
                    'Authorization': `aaaaaa`
                }
            });
            setQuestions([response.data.choices[0].message.content]); 
        } catch (error) {
            console.error("Error fetching question:", error);
        }
    };

    const handleAnswerSubmit = async () => {
        if (currentQuestionIndex < questions.length) {
            const newResponse = {
                sessionId,
                question: questions[currentQuestionIndex],
                answer
            };
            
            setResponses([...responses, newResponse]);

            
            await axios.post('http://localhost:3000/answers', newResponse);

            setAnswer('');
            await fetchNextQuestion();
        }
    };

    const fetchNextQuestion = async () => {
        try {
            const response = await axios.post('aaaaa', {
                model: "gpt-3.5-turbo", 
                messages: [{ role: "user", content: `Based on the answer "${answer}", generate a follow-up question about cats.` }],
                max_tokens: 60,
                temperature: 0.5,
            }, {
                headers: {
                    'Authorization': `****************`
                }
            });

            
            setQuestions(prevQuestions => [...prevQuestions, response.data.choices[0].message.content]);
            setCurrentQuestionIndex(prevIndex => prevIndex + 1); 
        } catch (error) {
            console.error("Error fetching next question:", error);
        }
    };




    return (
        <div>
            <h1>Chatbot</h1>
            <div>
                {responses.map((response, index) => (
                    <div key={index}>
                        <p><strong>Bot:</strong> {response.question}</p>
                        <p><strong>You:</strong> {response.answer}</p>
                    </div>
                ))}
            </div>
            {currentQuestionIndex < questions.length ? (
                <div>
                    <p><strong>Bot:</strong> {questions[currentQuestionIndex]}</p>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Your answer"
                    />
                    <button onClick={handleAnswerSubmit}>Submit Answer</button>
                </div>
            ) : (
                <h2>Thank you for your responses!</h2>
            )}
        </div>
    );
};

export default Chatbot;
