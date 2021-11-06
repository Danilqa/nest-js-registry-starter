import { TaskStatus } from '../task.enums';

export interface TaskDto {
    id: string;
    assignedUserId: string;
    description: string;
    status: TaskStatus;
}
