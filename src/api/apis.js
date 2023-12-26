import React from 'react'
import { defaultInstance } from './default.js'

const getCallList = async (data) => {
    try {
        const { data } = await defaultInstance.get(
            `/call/list`,
        )
        return data
    } catch (error) {
        console.log(error)
    }
}
const getServerStatus = async (data) => {
    try {
        console.log("status get start")
        const { data } = await defaultInstance.get(
            `/server/status`,
        )
        console.log("status get end")
        return data
    } catch (error) {
        console.log(error)
    }
}

const startServer = async()=>{
    try{
        var response = await defaultInstance.get('/server/start')
        console.log(response)
        return response
    }catch(error){
        console.log(error)
    }
}

const stopServer = async()=>{
    try{
        var response = await defaultInstance.get('/server/stop')
        console.log(response)
        return response
    }catch(error){
        console.log(error)
    }
}

const addNumber = async(sid,number)=>{
    // axios Instance.post 로 데이터 전송
    try {
        const { result } = await defaultInstance.post(`/call/addNumber`, {"sid":sid,"phnNum":number})
        return result
    } catch (error) {
        console.log(error)
    }
}

const delNumber = async(data)=>{
    // axios Instance.post 로 데이터 전송
    try {
        const { result } = await defaultInstance.post(`/call/delNumber`, {"seq":data})
        return result
    } catch (error) {
        console.log(error)
    }
}

export {
    getCallList,
    getServerStatus,
    startServer,
    stopServer,
    addNumber,
    delNumber
}