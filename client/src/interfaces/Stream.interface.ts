export interface IMessage {
    postedBy: string
    text: string
}

export default interface IStream {
    _id: string
    streamKey: string
    name: string
    messages: IMessage[]
}