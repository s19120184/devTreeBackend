

import { Request, Response } from "express";
import { Review } from "../Models/Review";

export class ReviewUseCase{

    static async createReview (req: Request, res: Response){
        try {
            await Review.create(req.body)
            res.status(201).send('Review creada correctamente')
            
        } catch (error) {
            res.send(error.message)
        }
       
    }

    static async getAllReviews (req: Request, res: Response){
        try {
            const allReviews = await Review.find()
            res.status(200).send(allReviews)
            
        } catch (error) {
            res.send(error.message)
        }
       
    }

    static async deleteReview (req: Request, res: Response){
        
        try {
            const reviewExist = await Review.findById(req.params.id)
            if(!reviewExist){
                res.status(404).send({"msg":'No review found'})
                return
            }
            
            const deleteReview = await Review.deleteOne( {_id:req.params.id})
            res.status(200).send({"msg":"Eliminado correctamente"})
            
        } catch (error) {
            res.status(400).send({error:error})
        }
       
    }

    
}