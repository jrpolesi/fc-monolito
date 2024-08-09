type Address = {
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
};

export interface AddClientInputDto {
  id?: string;
  name: string;
  email: string;
  document: string;
  address: Address;
}

export interface AddClientOutputDto {
  id: string;
  name: string;
  email: string;
  document: string;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}
