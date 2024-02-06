import { string } from "zod";
import HTTPError from "../common/errors/http-error";
import UnauthorizedError from "../common/errors/unauthorized-error";
import jwt, { JwtPayload } from "jsonwebtoken";


function verifyToken(token: string | undefined, roles: string[] | null = null) {
    if(!token) {
        throw new UnauthorizedError();
    }

    token = token.replace('Bearer ', '');

    try {
        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (roles && !roles.includes(tokenPayload.type)) {
            throw new UnauthorizedError();
        }

        return tokenPayload;
    } 
    catch (e) {
        if(e instanceof HTTPError) {
            throw e;
        }

        if(e instanceof Error) {
            throw new UnauthorizedError(e.message);
        }
    }
}

export default verifyToken;
