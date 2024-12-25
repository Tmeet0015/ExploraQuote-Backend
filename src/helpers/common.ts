import { Repository } from "typeorm";

export const checkForDuplicates = async <T>({ 
  repository, 
  field, 
  value 
}: { 
  repository: Repository<T>; 
  field: keyof T; 
  value: T[keyof T]; 
}): Promise<boolean> => {
  const existing = await repository.findOne({ where: { [field]: value } as any });
  return !!existing;
};


  
  export const paginate = (query: any, page: number, limit: number) => {
    const offset = (page - 1) * limit;
    query.skip(offset).take(limit);
    return query;
  };
  