interface Province {
  id: number; 
  name_th: string; 
  amphure: Amphure[]
}

interface Amphure {
  id: number; 
  name_th: string; 
  province_id: number; 
  tambon: Tambon[]
}

interface Tambon {
  id: number; 
  name_th: string; 
  amphure_id: number
}

export { Province,Amphure,Tambon };
