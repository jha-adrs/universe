"use client"
import { BrainCircuit, Home, LogIn, LogOut, Search, ShieldQuestion, PenSquare } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import QAComponent from '@/components/QAComponent'
import { z } from "zod"
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import TooltipWrapper from "@/components/TooltipWrapper"
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { getSession } from 'next-auth/react'
import { debounce } from 'lodash'


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
    const router = useRouter();
    const {loginToast} = useCustomToasts();
    

    const handleAnswering = (textInput) => {

        console.log('handleAnswering', textInput);
        
        const uuid = uuidv4();
        const timestamp = Date.now();
        // Store the current input value in a variable

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
                    context: {
                        questions : questions?.map((question)=>question.question),
                        answers : answers?.map((answer)=>answer.answer),
                    }
                }),
            });
            if (response.success === 0) {
                setIsAnswerFetching(false);
                setLoadingQuestionuuid('');
                setAnswers(answerReplacer(answers, uuid, 'Sorry, I cant answer your question. Try again later, ig?'));
            }

            // This data is a ReadableStream
            const data = response.body;
            if (!data) {
                return;
            }
            console.log('data', data);

            const oldAnswers = [...answers];
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
            console.log('result', result);
            // Set answer directly as stream is disabled
            setAnswers(answerReplacer(answers, uuid, result));

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
    return (
        <div className="flex flex-col w-full h-fit  no-scrollbar items-center justify-between">
            {/**Upper Icons */}
            <div className='flex w-full h-6 items-center justify-between'>
                <TooltipWrapper text={'New Chat'} Component={PenSquare} className="w-4 h-4 " onClick={()=>{
                    setAnswers([]);
                    setQuestions([]);
                    setRerender(0);
                    setTextInput('');
                    setIsAnswerFetching(false);
                    setLoadingQuestionuuid('');

                }} />
                <div>
                    <p className="font-bold text-lg gap-x-2 inline-flex items-center">
                        <TooltipWrapper Component={BrainCircuit} text="Home" className="w-5 h-5 cursor-pointer" onClick={()=>{
                            router.push('/');
                        }} />  UniChat
                    </p>
                </div>
                <TooltipWrapper text={'Help'} Component={ShieldQuestion} className="w-4 h-4 " 
                />
            </div>
            {/**Chat */}
            <div className='h-full w-full '>
                <QAComponent  questions={questions} isAnswerFetching={isAnswerFetching} answers={answers} loadingQuestionuuid={loadingQuestionuuid} />
            </div>
            {/**Search bar at sticky position */}

            <div className='fixed flex bottom-5  h-12 w-[90%] sm:w-[75%] md:w-[60%] lg:w-[50%] items-center justify-center   '>
                <div className='relative w-full bg-transparent items-center dark:bg-zinc-800 rounded-lg h-12 '>
                    <div className='relative flex flex-row w-full  items-center  rounded-lg border border-zinc-500 shadow-sm dark:shadow-transparent'>
                        <Search className='w-6 h-6 text-primary dark:text-white   ml-2' />
                        <input style={{ resize: 'none', outline: 'none', overflow: 'hidden' }}
                            placeholder='Ask UniChat...' name="" id="" cols="30" rows="1"
                            onChange={(e) => setTextInput(e.target.value)}
                            value={debouncedTextInput}
                            className='m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4'
                            autoFocus />
                        <button className='rounded-lg bg-zinc-100 dark:bg-zinc-700 mr-3 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                            onClick={(e) => {
                                handleAnswering(textInput);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    console.log(e.key)
                                    handleAnswering(textInput);
                                }
                            }}
                            disabled={textInput.length === 0 || isAnswerFetching}
                        >
                            <LogIn className=' w-4 h-4 mx-2  text-primary dark:text-white cursor-pointer my-2 ' />
                        </button>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Page

