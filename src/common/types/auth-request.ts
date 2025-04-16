import { Request } from 'express';

export interface AuthRequest extends Request {
    user: {
        sub: string;
        // poder incluir email, codename, etc se quiser estender depois
    };
}
