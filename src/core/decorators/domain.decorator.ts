import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export default createParamDecorator((data: undefined, ctx: ExecutionContext) => {

    const req = ctx.switchToHttp().getRequest<Request>();
    const domain = req.header('app-id')
    if(!domain){
        throw new BadRequestException(['app-id header required'])
    }
    return domain;
})