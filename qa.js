import { openai } from './openai.js'
import { Document } from '@langchain/core/documents'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings} from "@langchain/openai"
import { CharacterTextSplitter } from 'langchain/text_splitter'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { YoutubeLoader } from 'langchain/document_loaders/web/youtube'


// This line is used to get the question from the command line arguments
// when you type node qa "some question" the argv[2] represents the question in double quotes
const question = process.argv[2] || 'hi'

// link to Imam Omar Sulaiman YouTube video 
const video = `https://www.youtube.com/watch?v=c8wl4PQUbtE`

export const createStore = (docs) => MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings())


// This function takes a YouTube video URL as input, creates a YouTube loader with the specified options,
// and then loads and splits the video transcript into chunks using a CharacterTextSplitter.
const docsFromYTVideo = (video) => {
    const loader = YoutubeLoader.createFromUrl(video, {
        language: 'en',
        addVideoInfo: true,
    })

    return loader.loadAndSplit(
        new CharacterTextSplitter({
            separator: ' ',
            chunkSize: 2500,
            chunkOverlap: 100
        })
    )
}

// This function takes a PDF file as input, creates a PDF loader with the specified file,
// and then loads and splits the document into chunks using a CharacterTextSplitter.
const docsFromPDF = () => {
    const loader = new PDFLoader('xbox.pdf')
    return loader.loadAndSplit(
        new CharacterTextSplitter({
            separator: '. ',
            chunkSize: 2500,
            chunkOverlap: 200
        })
    )
}

const loadStore = async () => {
    const videoDocs = await docsFromYTVideo(video)
    const pdfDocs = await docsFromPDF()

    console.log(videoDocs[0], pdfDocs[0])
    return createStore([...videoDocs, ...pdfDocs])
}

const query = async () => {
    const store = await loadStore()
    const results = await store.similaritySearch(question, 2)
    console.log(results)
}

query()