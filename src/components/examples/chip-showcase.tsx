import { Chip, Separator, CloseButton } from "@heroui/react";
import { CircleDashed } from "@gravity-ui/icons";
import React from "react";
export function ChipShowcase(){
  const sizes = ["lg","md","sm"] as const;
  const variants = ["primary","secondary","tertiary","soft"] as const;
  const colors = ["accent","default","success","warning","danger"] as const;
  return (
    <div className="flex flex-col gap-8 overflow-x-auto">
      {sizes.map((size,index)=>(
        <React.Fragment key={size}>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-muted capitalize">{size}</h3>
            <div className="flex items-center gap-3"><div className="w-24 shrink-0"/>{colors.map(c=><div key={c} className="flex shrink-0 items-center justify-center" style={{width:"130px"}}><span className="text-xs text-muted capitalize">{c}</span></div>)}</div>
            <div className="flex flex-col gap-3">
              {variants.map(v=>(
                <div key={v} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 text-sm text-muted capitalize">{v}</div>
                  {colors.map(c=>(
                    <div key={c} className="flex shrink-0 items-center justify-center" style={{width:"130px"}}>
                      <Chip color={c as any} size={size as any} variant={v as any}><CircleDashed/><Chip.Label>Label</Chip.Label><CircleDashed/></Chip>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {index < sizes.length-1 && <Separator/>}
        </React.Fragment>
      ))}
      <div className="flex gap-4">
        <Chip>Label text</Chip>
        <CloseButton aria-label="Close" className="size-8 rounded-full bg-default text-muted hover:bg-default-hover hover:text-foreground active:scale-95" />
      </div>
    </div>
  )
}
