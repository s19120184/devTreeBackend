import mongoose from "mongoose";
import { User } from "./User";


interface  IReview {
     estrellas:number,
     comentario:string,
     nombreUsuario: string,

}

const ReviewSchema =  new mongoose.Schema({
    estrellas:{
        type: Number,
        required: true,
    },
    comentario:{
        type:String,
        require:true
    },
    nombreUsuario:{
        type:String,
        require:true,
        trimp:true
    }
})

export const Review = mongoose.model<IReview>('Review',ReviewSchema)