export function toRoman(n:number){
  const vals:[number,string][]=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
  let r=''
  for(const [v,s] of vals) while(n>=v){ r+=s; n-=v}
  return r
}
