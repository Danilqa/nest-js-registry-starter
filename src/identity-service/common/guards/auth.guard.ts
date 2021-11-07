import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { environment } from '../../../environments';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(@Inject(HttpService) private httpClient: HttpService) {}

    canActivate(context: ExecutionContext,): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    private async validateRequest(request: any): Promise<boolean> {
        if (!request.headers.authorization) {
            throw new HttpException('Authorization is not provided', HttpStatus.UNAUTHORIZED);
        }
        // @ts-ignore
        const [, token] = request.headers.authorization.split(' ');
        if (!token) {
            throw new HttpException('Token is not provided', HttpStatus.UNAUTHORIZED);
        }

        // TODO: move to env
        try {
            const res = await this.httpClient.post(
                `http://localhost:${environment.identity.port}/auth/validate`,
                {},
                { headers: { authorization: request.headers.authorization } }
            ).toPromise();
            return Promise.resolve(res.status.toString().startsWith('2'));
        } catch (e) {
            return Promise.resolve(false);
        }
    }
}
