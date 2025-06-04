"use client"
import _ from 'lodash'
import { BrainCircuit, Loader2, ThumbsDown, ThumbsUp } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '@/components/ui/use-toast';
import UserAvatar from './UserAvatar';
import { useSession } from 'next-auth/react';

const customScrollBar = {
    '&::-webkit-scrollbar': {
        width: '0.4em'

    },
    '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '1px solid slategrey'
    }
}

const QAComponent = ({ questions, answers, isAnswerFetching, loadingQuestionuuid }) => {
    const {data: session} = useSession();
    useEffect(() => {
        //console.log('QAComponent', questions, answers, "sess",session)
    }, [questions, answers])

    // Helper function to find answers for a question
    const findAnswerForQuestion = (questionUuid) => {
        if (!answers || !Array.isArray(answers)) return null;
        return answers.find(answer => answer.uuid === questionUuid);
    };

    // Helper function to format answer text with proper line breaks
    const formatAnswer = (text) => {
        if (text === 'Loading') return text;
        return text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    if (!questions || questions.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col space-y-6 w-full">
            {questions.map((question, index) => {
                const answer = findAnswerForQuestion(question.uuid);
                const isCurrentlyLoading = loadingQuestionuuid === question.uuid && isAnswerFetching;

                return (
                    <div key={question.uuid} className="flex flex-col space-y-4 w-full">
                        {/* Question */}
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                                <span className="font-semibold">Y</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium mb-1">You</p>
                                <div className="prose prose-sm dark:prose-invert">
                                    <p>{question.question}</p>
                                </div>
                            </div>
                        </div>

                        {/* Answer */}
                        {answer && (
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                                    <span className="font-semibold">M</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium mb-1">Max</p>
                                    <div className={`prose prose-sm dark:prose-invert ${isCurrentlyLoading ? 'opacity-60' : ''}`}>
                                        {isCurrentlyLoading ? (
                                            <div className="flex items-center space-x-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <p>Thinking...</p>
                                            </div>
                                        ) : answer.answer === 'Loading' ? (
                                            <div className="flex items-center space-x-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <p>Thinking...</p>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                                                {formatAnswer(answer.answer)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        {index < questions.length - 1 && (
                            <hr className="border-t border-zinc-200 dark:border-zinc-800" />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default QAComponent

// Not exported components
const InitialComponent = () => {
    return (
        <div className='flex  flex-col items-center justify-center h-full w-full '>
            <div className='flex flex-col items-center justify-center'>
                <BrainCircuit className='w-10 h-10 inline-block text-primary dark:text-white my-4 rotate-90' />
                <h1 className='text-5xl font-bold text-center'>
                    Chatbot
                </h1>
                <h3 className='pt-4 font-semibold text-gray-400'>
                    Alpha v0.5
                </h3>
                <p className='text-gray-500 pt-4 text-center'>
                    Please note that information provided here is not guaranteed to be correct.
                    <br />Please refer to official sources for accurate information.
                    <br />
                </p>
            </div>
        </div>
    )
}

const QAPopulatedComponent = ({ questions, answers, isAnswerFetching, loadingQuestionuuid ,session}) => {
    const ScrollEndRef = useRef(null);
    const scrollToBottom = () => {
        ScrollEndRef.current?.scrollIntoView({ behavior: "auto" })
    }
    useEffect(() => {
        scrollToBottom();
    }, [questions, answers])
    return (
        <div className="fixed flex w-full  justify-center h-[80%] ">
            <div className='flex flex-col h-full w-[85%] sm:w-[80%] md:w-[65%] '>
                <div className=' py-5 justify-start  w-full h-full max-h-[80%] overflow-y-auto no-scrollbar' >
                    {questions?.map((question, index) => {
                        // For each question and answer, we need to render a QAComponent
                        // We need to check if the answer is present or not
                        // If answer is present, we need to render the answer and question
                        return (
                            <>

                                <MiniTextComponent key={question?.uuid} type='question' text={question?.question} session={session}/>
                                {answers && answers?.length > 0 && answers?.map((answer, index) => {
                                    if (answer?.uuid === question?.uuid) {
                                        return (
                                            <MiniTextComponent key={answer?.answer_uuid} type='answer' text={answer?.answer} isLoading={isAnswerFetching} loadingQuestionuuid={loadingQuestionuuid} currentuuid={question?.uuid} currentQuestion={question.question} session={session} />
                                        )
                                    }
                                })}

                            </>
                        )

                    })}
                    <div ref={ScrollEndRef} />
                </div>

            </div>
        </div>
    )
}

const MiniTextComponent = ({ type, text, isLoading, loadingQuestionuuid, currentuuid, currentQuestion,session }) => {
    const [feedback, setFeedback] = useState(null) // [UP, DOWN]
    const { toast } = useToast();
    const handleFeedback = (value) => {
        if (feedback === value) {
            setFeedback(null);
            toast({
                title: 'Feedback removed',
                description: 'Your feedback has been removed',
                status: 'info',
            })
        } else {
            if (feedback !== null) {
                toast({
                    title: 'Feedback changed',
                    description: 'Your feedback has been changed',
                    status: 'info',
                })
            } else {
                toast({
                    title: 'Feedback added',
                    description: 'Thanks for making UniChat better!',
                    status: 'info',
                })
            }
            setFeedback(value);
            console.log(currentQuestion, text, value)
            let res;
            fetch('/api/chat/feedback', {
                method: 'POST',
                body: JSON.stringify({
                    question: currentQuestion,
                    answer: text,
                    feedback: value
                })
            })
                .then(data => {
                    //console.log(data)
                    res = data;
                })
                .catch(err => {
                    console.log(err)
                })

        }

    }
    const chatbotDiv = <div className='w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center'>
        <p className='font-medium text-xs p-0 m-0'>
            <BrainCircuit className='w-4 h-4 text-white font-medium' />
        </p>

    </div>
    const userDiv = <div className='w-6 h-6 rounded-full bg-purple-700 flex items-center justify-center'>

        <UserAvatar user={session?.user} className='w-6 h-6 text-white font-medium rounded-full' />

    </div>;
    if (text === null && !isLoading) return (<></>)
    return (
        <>
            <div className='flex flex-row items-center justify-start mb-4'>
                <div className="flex flex-col">
                    <div className="flex">
                        {type == 'question' ? userDiv : chatbotDiv}
                        <p className='text-zinc-800 dark:text-gray-300 text-md font-extrabold ml-2'>{type == 'question' ? "You" : "UniChat"}</p>
                    </div>
                    <div className='ml-6'>
                        <p className='text-zinc-800 dark:text-gray-300 text-md font-medium ml-2 w-full overflow-auto break-words no-scrollbar'>
                            {(type !== "question" && (loadingQuestionuuid == currentuuid)) ? <Loader2 className='animate-spin' /> : text}
                        </p>
                    </div>
                    {
                        type == 'question' ? null : (<div className='inline-flex gap-x-4 mt-4 items-center'>
                            <ThumbsUp className={`w-4 h-4 font-medium cursor-pointer ${feedback === "UP" ? "fill-black dark:fill-white" : ""}`} onClick={() => handleFeedback("UP")} />
                            <ThumbsDown className={`w-4 h-4 font-medium cursor-pointer ${feedback === "DOWN" ? "fill-black dark:fill-white" : ""}`} onClick={() => handleFeedback("DOWN")} /></div>)
                    }
                </div>
            </div>
        </>
    )
}