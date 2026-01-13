// ===========================
// VALIDATION MIDDLEWARE
// ===========================


import { Request,Response ,NextFunction} from 'express';
import { ApiResponse,Priority,TaskStatus } from '../interfaces/task.interface';

// valid values for validation
const VALID_PRIORITIES: Priority[] = ['low','medium','high'];
const VALID_STATUSES: TaskStatus[] = ['pending','in-process','completed']

// validate task creation request

export const validateCreateTask = (
    req:Request,
    res:Response,
    next:NextFunction
): void => {
    const {title, priority,due_date}=req.body;
    

    //check if title exisits and is not empty
    if(!title || typeof title !== "string" || title.trim() === ''){
        const response: ApiResponse<null>={
            success:false,
            message: "Validation failed",
            error: "Title is required and must be an non-empty string",
        };
        res.status(400).json(response);
        return;
    }

    //check title length
    if(title.length> 255){
        const response: ApiResponse<null> = {
            success:false,
            message:"Validation Failed",
            error:"Title must be 255 character or less",
        };
        res.status(400).json(response);
        return ;
    }

    // validate priority if provided
    if(priority && !VALID_PRIORITIES.includes(priority)){
        const response: ApiResponse<null> = {
            success:false,
            message:"Validation Failed",
            error:"Priority must be one of 'low', 'medium', or 'high'",
        };
        res.status(400).json(response);
        return ;
    }


    // validate due_date format is provided
    if(due_date){
        const date = new Date(due_date);
        if(isNaN(date.getTime())){
            const response: ApiResponse<null> ={
                success:false,
                message:"Validation failed",
                error:"Invalid date format for due_date Use iso format YYYY-MM-DD",
            };
            res.status(400).json(response);
            return ;
        }
    }

    // validation passed
    next();
}

// ================================
// Validate task update request
// ================================

export const validateUpdateTask = (
    req:Request,
    res:Response,
    next:NextFunction
): void => {
    const {title, status,priority,due_date}=req.body;

    //check if at least one field is provided
    if(Object.keys(req.body).length === 0){
        const response: ApiResponse<null> ={
            success: false,
            message: "validation failed",
            error: "at least one field is required for update",
        };
        res.status(400).json(response);
        return;
    }


    // validate title if provided
    if(title!==undefined){
        if(typeof title !== 'string' || title.trim() === ""){
            const response:ApiResponse<null> = {
                success:false,
                message:"validation failed",
                error:"title must be a non-empty string",
            };
            res.status(400).json(response);
            return;
        }
        if(title.length > 255){
            const response: ApiResponse<null>={
                success: false,
                message: "validation failed",
                error:"title must be 255 characters or less",
            };
            res.status(400).json(response);
            return;
        }
    }


    // validate status if provided
    if(status && !VALID_STATUSES.includes(status)){
        const response: ApiResponse<null> ={
            success:false,
            message: "validation failed",
            error : "status must be any one of pending, in-process, completed",
        }
        res.status(400).json(response);
        return;
    }



    //validate priority if provided
    if (priority && !VALID_PRIORITIES.includes(priority)) {
        const response: ApiResponse<null> = {
            success: false,
            message: 'Validation failed',
            error: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
        };
        res.status(400).json(response);
        return;
    }

    // validate due_date if provided
    if (due_date) {
        const date = new Date(due_date);
        if (isNaN(date.getTime())) {
            const response: ApiResponse<null> = {
                success: false,
                message: 'Validation failed',
                error: 'Invalid date format for due_date',
            };
            res.status(400).json(response);
            return;
        }
    }

    next();

};



// ==================================
// Validate UUID format for task ID
// ==================================

export const validateTaskId =(
    req:Request,
    res:Response,
    next:NextFunction
): void =>{

    const id = req.params.id as string;

    // uuid v4 regex pattern
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if(!uuidRegex.test(id)){
        const response: ApiResponse<null> = {
            success:false,
            message:"Validation failed",
            error:"invalid task ID format. Must be a valid UUID",
        };
        res.status(400).json(response);
        return;
    }

    next();
};

// ====================================
// Validate query parameters
// ====================================

export const validateQueryParams = (
    req:Request,
    res:Response,
    next:NextFunction,
):void=> {
    const {status,priority,limit,offset,order}=req.query;

    //validate stauts if provided
    if(status && !VALID_STATUSES.includes(status as TaskStatus)){
        const response: ApiResponse<null>={
            success:false,
            message:"validation failed",
            error:"invalid prioirty must be one of pending,in-process,completed"
        };
        res.status(400).json(response);
        return;
    }


    // validate priority if provided
    if(priority && !VALID_PRIORITIES.includes(priority as Priority)){
        const response: ApiResponse<null> ={
            success:false,
            message:"validation failed",
            error: "invalid priority must be high medium low"
        };
        res.status(400).json(response);
        return;
    }



    // validate limit
     if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
        const response: ApiResponse<null> = {
            success: false,
            message: 'Validation failed',
            error: 'Limit must be a number between 1 and 100',
        };
        res.status(400).json(response);
        return;
    }

     // Validate offset
    if (offset && (isNaN(Number(offset)) || Number(offset) < 0)) {
        const response: ApiResponse<null> = {
            success: false,
            message: 'Validation failed',
            error: 'Offset must be a non-negative number',
        };
        res.status(400).json(response);
        return;
    }


 // Validate order
    if (order && !['asc', 'desc'].includes(order as string)) {
        const response: ApiResponse<null> = {
            success: false,
            message: 'Validation failed',
            error: 'Order must be either "asc" or "desc"',
        };
        res.status(400).json(response);
        return;
    }

    next();


}