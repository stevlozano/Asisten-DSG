import { cn } from "@/lib/utils";
export function Button({className,...p}: React.ButtonHTMLAttributes<HTMLButtonElement>){ return <button className={cn("bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium",className)} {...p}/> }
