import { Timestamp } from '../../utils';
export interface SubscriptionInfoModel {
    plan: Plan;
    startDate: Timestamp;
    endDate?: Timestamp;
    autoRenew: boolean;
}
export type Plan = 'FREE' | 'PREMIUM';
