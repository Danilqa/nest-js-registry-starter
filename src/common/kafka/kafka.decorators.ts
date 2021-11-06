export const SUBSCRIBER_FN_REF_MAP = new Map();
export const SUBSCRIBER_FIXED_FN_REF_MAP = new Map();
export const SUBSCRIBER_OBJ_REF_MAP = new Map();

export function SubscribeTo(topic: string) {
    return (target: any, propertyKey: string) => {
        const originalMethod = target[propertyKey as keyof typeof target];

        target[propertyKey as keyof typeof target] = function (...params: any[]) {
            return originalMethod.call(this, ...params);
        };

        SUBSCRIBER_FN_REF_MAP.set(topic, target[propertyKey as keyof typeof target]);
        SUBSCRIBER_OBJ_REF_MAP.set(topic, target);

        return target[propertyKey as keyof typeof target];
    };
}
