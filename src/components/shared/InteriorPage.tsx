import type { ReactNode } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
type Props={eyebrow:string;title:string;copy:string;children?:ReactNode};
export function InteriorPage({eyebrow,title,copy,children}:Props){return <><section className="surface-charcoal-gradient border-b border-white/10 pt-20"><div className="container-shell pb-16 pt-24 sm:pb-24 sm:pt-32"><SectionHeading eyebrow={eyebrow} title={title} copy={copy}/></div></section>{children}</>}
