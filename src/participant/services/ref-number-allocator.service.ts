import { Injectable } from '@nestjs/common';

@Injectable()
export class RefNumberAllocatorService {

    generate(): string {
        return new Date()
            .getTime()
            .toString();
    }
}