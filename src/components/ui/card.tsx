import { cn } from "@/lib/utils";
export function Card({className,...p}: React.HTMLAttributes<HTMLDivElement>){ return <div className={cn("bg-card rounded-[24px] p-6 shadow-sm border",className)} {...p} /> }
export function CardHeader(p:any){return <div {...p}/>}
export function CardContent(p:any){return <div {...p}/>}
