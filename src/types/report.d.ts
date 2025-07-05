interface Report {
  id?: number;
  fullName?: string;
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  gender?: string | null;
  province?: string | null, 
  amphure?:  string | null, 
  tambon?:  string | null,
  conditions?: string;
  createAt?: Date;
}

export { Report };
