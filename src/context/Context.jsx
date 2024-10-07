import { createContext, useState } from "react";
import runChat from "../config/gemini";


export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
             setTimeout(function(){
                setResultData(prev=>prev+nextWord);
             },75*index)
    }

    const newChat=() => {
        setLoading(false)
        setShowResult(false)
    }


    const onSent = async (prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !== undefined){
              response=await runChat(prompt);
              setRecentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompt(input)
            response= await runChat(input)
        }
        let responseArray= response.split("*")
        let newResponce="";
        for(let i=0;i<responseArray.length;i++)
        {
            if(i==0||i%2!=1){
                newResponce += responseArray[i];
            }
            else{
                newResponce += "<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponce2 = newResponce.split("*").join("</br>")
        let newResponceArray = newResponce2.split(" ");
        for(let i=0;i<newResponceArray.length;i++)
            {

               const nextWord = newResponceArray[i];
               delayPara(i,nextWord+" ")
        }
        setLoading(false)
        setInput("")

    }



    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider