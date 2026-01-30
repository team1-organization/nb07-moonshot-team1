import { Request, Response, NextFunction, RequestHandler } from 'express';
import { prisma } from '../lib/prisma';

export const createProject = async (req: Request, res: Response) => {
    try {
        const { user_id, title, description } = req.body;
        const projectCount = await prisma.project.count({
            where:{ user_id : Number(user_id)} 
        });
        
        if(projectCount > 5){
            return res.status(400).json({ message: "유저당 최대 5개의 프로젝트만 생성 가능합니다." });
        };
        
        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                user_id: Number(user_id),
            }
        });
        return res.status(201).json(newProject)
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "서버 오류 발생"});
    }
}