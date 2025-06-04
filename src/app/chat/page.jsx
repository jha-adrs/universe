"use client"
import { BrainCircuit, LogIn, Search, ShieldQuestion, PenSquare, Loader2, Clock, MessageSquare } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import QAComponent from '@/components/QAComponent'
import { z } from "zod"
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import TooltipWrapper from "@/components/TooltipWrapper"
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { getSession } from 'next-auth/react'
import { debounce } from 'lodash'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDistanceToNow } from 'date-fns'

const questionSchema = z.object({
    question: z.string().max(1000).min(1),
})

const answerReplacer = (answersArray, uuid, answer, timestamp = Date.now()) => {
    if (typeof answer !== 'string') {
        return answersArray;
    }
    if (typeof answersArray === 'undefined') {
        return [];
    }
    const oldAnswers = [...answersArray];
    const index = oldAnswers.findIndex((answer) => answer.uuid === uuid);
    if (index === -1) {
        // Create new answer
        oldAnswers.push({
            uuid: uuid,
            answer: answer,
            answer_timestamp: timestamp,
            answer_uuid: uuidv4(),
        });
        return oldAnswers;
    }
    oldAnswers[index].answer = answer;
    oldAnswers[index].answer_timestamp = timestamp;
    oldAnswers[index].answer_uuid = uuidv4();
    return oldAnswers;
}

const Page = ({ params }) => {
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [textInput, setTextInput] = useState('');
    const [isAnswerFetching, setIsAnswerFetching] = useState(false);
    const [rerender, setRerender] = useState(0);
    const [loadingQuestionuuid, setLoadingQuestionuuid] = useState('');
    const [debouncedTextInput, setDebouncedTextInput] = useState('');
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState('');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const router = useRouter();
    const { loginToast } = useCustomToasts();

    // Fetch conversations
    const fetchConversations = async () => {
        try {
            setIsLoading(true);
            const session = await getSession();
            if (!session) {
                loginToast();
                return;
            }
            
            const response = await fetch('/api/chat/conversations');
            if (!response.ok) throw new Error('Failed to fetch conversations');
            
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            toast({
                title: 'Error',
                description: 'Failed to load previous conversations',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchConversations();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (textInput.trim().length > 0 && !isAnswerFetching) {
                handleAnswering(textInput);
            }
        }
    };

    const handleAnswering = (textInput) => {
        if (textInput.trim().length === 0 || isAnswerFetching) return;
        
        // Generate a new conversation ID if we don't have one yet
        if (!currentConversationId) {
            setCurrentConversationId(uuidv4());
        }

        const uuid = uuidv4();
        const timestamp = Date.now();

        setQuestions([...questions, { uuid: uuid, question: textInput, timestamp: timestamp }]);
        setAnswers(
            answerReplacer(answers, uuid, 'Loading')
        );
        setRerender(rerender + 1);
        setTextInput('');
        answerQuestion(textInput, uuid);
    }

    const answerQuestion = async (text, uuid) => {
        try {
            console.log('answerQuestion', text, uuid);
            const session = await getSession();
            if (!session) {
                setIsAnswerFetching(false);
                loginToast();
                return;
            }
            setIsAnswerFetching(true);
            setLoadingQuestionuuid(uuid);
            const response = await fetch(`api/chat/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: text,
                    stream: false,
                    conversationId: currentConversationId,
                    context: {
                        questions: questions?.map((question) => question.question),
                        answers: answers?.map((answer) => answer.answer),
                    }
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to get response');
            }
            
            // This data is a ReadableStream
            const data = response.body;
            if (!data) {
                return;
            }

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let result = '';

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    result += decoder.decode(value);
                }
            }
            
            // Set answer directly as stream is disabled
            setAnswers(answerReplacer(answers, uuid, result));
            
            // Refresh the conversation list after getting a response
            fetchConversations();
            
            setLoadingQuestionuuid('');
            setIsAnswerFetching(false);
        } catch (error) {
            console.log(error);
            setAnswers(answerReplacer(answers, uuid, 'Sorry, I cant answer your question. Try again later?'));
            setIsAnswerFetching(false);
            setLoadingQuestionuuid('');
        }
    };
    
    useEffect(() => {
        const updateDebouncedTextInput = debounce(() => setDebouncedTextInput(textInput), 50);
        updateDebouncedTextInput();
        return updateDebouncedTextInput.cancel;
    }, [textInput]);
    
    const resetChat = () => {
        setAnswers([]);
        setQuestions([]);
        setRerender(0);
        setTextInput('');
        setIsAnswerFetching(false);
        setLoadingQuestionuuid('');
        setCurrentConversationId('');
        setIsHistoryOpen(false);
    };
    
    const loadConversation = (conversationId) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            resetChat();
            
            // Set the current conversation ID
            setCurrentConversationId(conversationId);
            
            // Process and set the messages
            const newQuestions = [];
            const newAnswers = [];
            
            conversation.messages.forEach(message => {
                if (message.question) {
                    const uuid = uuidv4();
                    newQuestions.push({
                        uuid,
                        question: message.question,
                        timestamp: new Date(message.timestamp).getTime()
                    });
                    
                    if (message.answer) {
                        newAnswers.push({
                            uuid,
                            answer: message.answer,
                            answer_timestamp: new Date(message.timestamp).getTime(),
                            answer_uuid: uuidv4()
                        });
                    }
                }
            });
            
            setQuestions(newQuestions);
            setAnswers(newAnswers);
            setIsHistoryOpen(false);
        }
    };
    
    return (
        <div className="flex flex-col h-[89vh] overflow-hidden">
            {/* Header */}
            <div className='flex h-14 items-center justify-between px-4 border-b dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-900 z-10'>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost"
                        size="icon"
                        onClick={resetChat}
                        aria-label="New Chat"
                    >
                        <PenSquare className="w-5 h-5" />
                    </Button>
                    
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            fetchConversations();
                            setIsHistoryOpen(true);
                        }}
                        aria-label="Show History"
                    >
                        <Clock className="w-5 h-5" />
                    </Button>
                </div>
                
                <div>
                    <p className="font-bold text-lg gap-x-2 inline-flex items-center">
                        <TooltipWrapper 
                            Component={({ className }) => (
                                <BrainCircuit 
                                    className={`w-5 h-5 cursor-pointer ${className}`} 
                                    onClick={() => router.push('/')}
                                />
                            )} 
                            text="Home" 
                        />  
                        UniChat
                    </p>
                </div>
                
                <TooltipWrapper 
                    text='Help' 
                    Component={({ className }) => (
                        <Button variant="ghost" size="icon" className={className}>
                            <ShieldQuestion className="w-5 h-5" />
                        </Button>
                    )}
                />
            </div>
            
            {/* Chat area */}
            <div className='flex-1 overflow-auto w-full max-w-4xl mx-auto px-4 py-6'>
                {questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh]">
                        <BrainCircuit className="w-16 h-16 mb-4 text-primary/50" />
                        <h2 className="text-xl font-semibold mb-2">Welcome to UniChat</h2>
                        <p className="text-center text-muted-foreground">
                            Ask me anything about the university!
                        </p>
                    </div>
                ) : (
                    <QAComponent 
                        questions={questions} 
                        isAnswerFetching={isAnswerFetching} 
                        answers={answers} 
                        loadingQuestionuuid={loadingQuestionuuid} 
                    />
                )}
            </div>
            
            {/* Input area */}
            <div className='border-t dark:border-zinc-700 p-4'>
                <div className='max-w-4xl mx-auto'>
                    <div className='relative w-full bg-transparent items-center rounded-lg'>
                        <div className='relative flex flex-row w-full items-center rounded-lg border border-zinc-300 dark:border-zinc-600 shadow-sm dark:shadow-transparent focus-within:ring-1 focus-within:ring-primary focus-within:border-primary'>
                            <Search className='w-5 h-5 text-muted-foreground ml-3 flex-shrink-0' />
                            <textarea
                                style={{ resize: 'none', outline: 'none' }}
                                placeholder='Ask UniChat...' 
                                onChange={(e) => setTextInput(e.target.value)}
                                value={debouncedTextInput}
                                className='m-0 w-full resize-none border-0 bg-transparent py-3 pr-10 focus:ring-0 focus-visible:ring-0 md:py-3.5 md:pr-12 placeholder:text-muted-foreground pl-3 md:pl-4 max-h-32'
                                autoFocus
                                rows={1}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                type='submit'
                                className={`rounded-md p-2 mr-2 ${
                                    textInput.trim().length === 0 || isAnswerFetching
                                    ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-primary/90'
                                }`}
                                onClick={() => handleAnswering(textInput)}
                                disabled={textInput.trim().length === 0 || isAnswerFetching}
                            >
                                {isAnswerFetching ? (
                                    <Loader2 className='w-5 h-5 animate-spin' />
                                ) : (
                                    <LogIn className='w-5 h-5' />
                                )}
                            </button>
                        </div>
                        
                        <div className='text-xs text-center text-muted-foreground mt-1'>
                            <span><kbd className="px-1 rounded border">⇧Shift+↵Enter</kbd> new line • <kbd className="px-1 rounded border">↵Enter</kbd> send</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Dialog */}
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Conversation History
                        </DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto pr-1">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-20">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground">
                                <p>No previous conversations</p>
                            </div>
                        ) : (
                            <div className="space-y-2 mt-2">
                                {conversations.map((conversation) => (
                                    <button
                                        key={conversation.id}
                                        onClick={() => loadConversation(conversation.id)}
                                        className="w-full text-left p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700"
                                    >
                                        <div className="flex items-start gap-2">
                                            <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground" />
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-medium truncate">
                                                    {conversation.title.length > 40 
                                                        ? conversation.title.substring(0, 40) + '...' 
                                                        : conversation.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between pt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsHistoryOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={resetChat}
                        >
                            <PenSquare className="w-4 h-4 mr-2" />
                            New Chat
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Page

