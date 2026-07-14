export type InterestInput={name:string;phone:string;email:string;area:string;experience:string;preferredContact:string;bestTime:string;message?:string};
export function hasRequiredInterestFields(input:Partial<InterestInput>):input is InterestInput{return Boolean(input.name&&input.phone&&input.email&&input.area&&input.experience&&input.preferredContact&&input.bestTime);}
