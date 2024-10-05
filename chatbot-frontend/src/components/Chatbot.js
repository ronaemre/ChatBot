import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const Chatbot = () => {
    const [sessionId, setSessionId] = useState('');
    const [questions] = useState([
        "What is your favorite breed of cat, and why?",
        "How do you think cats communicate with their owners?",
        "Have you ever owned a cat? If so, what was their name and personality like?",
        "Why do you think cats love to sleep in small, cozy places?",
        "What’s the funniest or strangest behavior you’ve ever seen a cat do?",
        "Do you prefer cats or kittens, and what’s the reason for your preference?",
        "Why do you think cats are known for being independent animals?",
        "How do you think cats manage to land on their feet when they fall?",
        "What’s your favorite fact or myth about cats?",
        "How would you describe the relationship between humans and cats in three words?"
    ]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [responses, setResponses] = useState([]);
    const messagesEndRef = useRef(null);
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        const sessionId = Math.random().toString(36).substring(7);
        setSessionId(sessionId);

        if (questions.length > 0) {
            setResponses([{ sessionId: 'bot', question: questions[0], answer: '' }]);
        }
    }, []);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [responses]);

    const handleAnswerSubmit = async () => {
        const finished = currentQuestionIndex === questions.length - 1 ? "true" : "false";
        const newResponse = {
            sessionId,
            question: questions[currentQuestionIndex],
            answer,
            finished
        };

        setResponses((prev) => [...prev, newResponse]);
        await axios.post('http://localhost:3000/answers', newResponse);
        setAnswer('');


        setCurrentQuestionIndex((prev) => prev + 1);


        if (currentQuestionIndex < questions.length - 1) {
            const botResponse = { sessionId: 'bot', question: questions[currentQuestionIndex + 1], answer: '' };
            setResponses((prev) => [...prev, botResponse]);
        } else {
            console.log("Thank you for completing the questions!");
        }
    };


    const toggleChat = () => {
        setChatOpen(!chatOpen);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">My Awesome Site</Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
                    <Box sx={{ width: 240 }}>
                        <List>
                            <ListItem button>
                                <ListItemText primary="Home" />
                            </ListItem>
                            <ListItem button>
                                <ListItemText primary="About" />
                            </ListItem>
                            <ListItem button>
                                <ListItemText primary="Services" />
                            </ListItem>
                            <ListItem button>
                                <ListItemText primary="Contact" />
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
                <Box sx={{ flexGrow: 1, padding: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to the Mock Site!
                    </Typography>
                    <Typography>
                        This is a simple mockup of a website to demonstrate the layout. Feel free to explore chatbot functionality by clicking the chat icon below.
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: '0.3s',
                    display: chatOpen ? 'block' : 'none',
                    width: 400,
                }}
            >
                <Box sx={{ padding: 2 }}>
                    <IconButton onClick={toggleChat} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" align="center">Chatbot</Typography>
                    <Box sx={{ maxHeight: 300, overflowY: 'auto', marginBottom: 2 }}>
                        {responses.map((response, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: response.sessionId === sessionId ? 'flex-end' : 'flex-start',
                                    marginBottom: 1
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: '70%',
                                        padding: 1,
                                        borderRadius: 2,
                                        bgcolor: response.sessionId === 'bot' ? '#d1ffd1' : '#e0e0e0',
                                        boxShadow: 1,
                                        wordWrap: 'break-word'
                                    }}
                                >
                                    <Typography variant="body1">
                                        <strong>{response.sessionId === 'bot' ? 'Bot:' : 'You:'}</strong> {response.answer || response.question}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                        <div ref={messagesEndRef} />
                    </Box>
                    {currentQuestionIndex < questions.length ? (
                        <Box display="flex" justifyContent="space-between">
                            <TextField
                                variant="outlined"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Your answer"
                                fullWidth
                                sx={{ marginRight: 1 }}
                            />
                            <Button variant="contained" color="primary" onClick={handleAnswerSubmit}>
                                Submit Answer
                            </Button>
                        </Box>
                    ) : (
                        <Typography variant="h6" align="center">
                            Thank you for your responses!
                        </Typography>
                    )}
                </Box>
            </Box>
            {!chatOpen && (
                <IconButton
                    onClick={toggleChat}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        boxShadow: 3,
                        width: 64,
                        height: 64,
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                        animation: 'breathing 2s infinite',
                        '@keyframes breathing': {
                            '0%': {
                                transform: 'scale(1)',
                            },
                            '50%': {
                                transform: 'scale(1.1)',
                            },
                            '100%': {
                                transform: 'scale(1)',
                            },
                        },
                    }}
                >
                    <ChatIcon sx={{ fontSize: 36 }} />
                </IconButton>
            )}
        </Box>
    );
};

export default Chatbot;
