import { Response } from "express";
import HTTPError from "../common/errors/http-error";
import HTTPStatus from "../common/enums/http-status";
import InternalServerError from "../common/errors/internal-server-error";

async function controllerHandleErrors<T>(res: Response, func: () => T) {
    try {
        return await func();
    }
    catch(e) {
        if(e instanceof HTTPError) {
            if(e instanceof InternalServerError) {
                console.error(e.message);
                res.status(e.status).send(HTTPStatus.InternalServerError.message);
            }
            else {
                res.status(e.status).send({ error: e.message });
            }
        }
        else if(e instanceof Error) {
            res.status(HTTPStatus.InternalServerError.status).send({ error: e.message });
        }
    }
}

export default controllerHandleErrors;
