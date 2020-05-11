export function chainLoad(data: ChainLoadData) {
    let resultFunction: Function = data.onLoadingFinish
    data.chain.reverse().forEach(loadFunction => {
        resultFunction = () => {
            loadFunction({
                successCallback: () => resultFunction(),
                errorCallback: () => data.onLoadingFinish(),
            })
        }
    })
    resultFunction()
}

export type LoadData = {
    successCallback: Function
    errorCallback: Function
}

export type LoadFunction = (data: LoadData) => void

export type ChainLoadData = {
    chain: LoadFunction[],
    onLoadingFinish: () => void,
}