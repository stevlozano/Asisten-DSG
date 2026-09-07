import { ChipShowcase } from "@/components/examples/chip-showcase"
import { SelectDemo } from "@/components/ui-library/select-demo"
import { TanstackTable } from "@/components/examples/tables"
import { CustomCells } from "@/components/examples/table-editable"
import { BasicTabs, VerticalTabs } from "@/components/examples/tabs-demo"
export default function Page(){ return <div className="space-y-8">
<h1 className="text-2xl font-bold">Librería ASISTEN-DSG — HeroUI + shadcn</h1>
<section className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6"><h2 className="font-semibold mb-4">Select</h2><SelectDemo/></section>
<section className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6"><h2 className="font-semibold mb-4">Tabla solo visualización (TanStack + HeroUI)</h2><TanstackTable/></section>
<section className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6"><h2 className="font-semibold mb-4">Tabla editable (selección + acciones)</h2><CustomCells/></section>
<section className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6"><h2 className="font-semibold mb-2">Tabs — Horizontal</h2><BasicTabs/></section>
<section className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6"><h2 className="font-semibold mb-2">Tabs — Vertical</h2><VerticalTabs/></section>
<section className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6"><h2 className="font-semibold mb-4">Chip / CloseButton</h2><ChipShowcase/></section>
</div>}
