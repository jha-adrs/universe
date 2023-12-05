"use client"
import _ from 'lodash'
import { BrainCircuit, Loader2 } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

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

const QAComponent = ({ questions, isAnswerFetching, answers,loadingQuestionuuid }) => {
    useEffect(() => {
        console.log('QAComponent', questions, answers)

    }, [questions, answers])

    return (
        <div className='py-5 h-full'>
            {
                questions?.length === 0 ? <InitialComponent /> : <QAPopulatedComponent questions={questions} answers={answers} isAnswerFetching={isAnswerFetching} loadingQuestionuuid={loadingQuestionuuid} />
            }
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

const QAPopulatedComponent = ({ questions, answers, isAnswerFetching,loadingQuestionuuid }) => {
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

                                <MiniTextComponent key={question?.uuid} type='question' text={question?.question} />
                                {answers && answers?.length > 0 && answers?.map((answer, index) => {
                                    if (answer?.uuid === question?.uuid) {
                                        return (
                                            <MiniTextComponent key={answer?.answer_uuid} type='answer' text={answer?.answer} isLoading={isAnswerFetching} loadingQuestionuuid={loadingQuestionuuid} currentuuid={question?.uuid} />
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

const MiniTextComponent = ({ type, text, isLoading, loadingQuestionuuid , currentuuid}) => {

    const chatbotDiv = <div className='w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center'>
        <p className='font-medium text-xs p-0 m-0'>
            <BrainCircuit className='w-4 h-4 text-white font-medium' />
        </p>
    </div>
    const userDiv = <div className='w-6 h-6 rounded-full bg-purple-700 flex items-center justify-center'>
        <p className='font-light text-white text-xs p-0 m-0'>
            U
        </p>
    </div>;
    console.log('MiniTextComponent', isLoading, loadingQuestionuuid, currentuuid)
    if (text === null && !isLoading ) return (<></>)
    return (
        <>
            <div className='flex flex-row items-center justify-start mb-4'>
                <div className="flex flex-col">
                    <div className="flex">
                        {type == 'question' ? userDiv : chatbotDiv}
                        <p className='text-zinc-800 dark:text-gray-300 text-md font-extrabold ml-2'>{type == 'question' ? "You" : "UniChat"}</p>
                    </div>
                    <div className='ml-6'>
                        <p className='text-zinc-800 dark:text-gray-300 text-md font-medium ml-2 w-full overflow-auto break-all no-scrollbar'>
                        {( type!=="question" && (loadingQuestionuuid == currentuuid)) ? <Loader2 className='animate-spin' /> : text}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}