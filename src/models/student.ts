import { ObjectId } from "mongodb";

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  district: string;
}

export interface Student {
  _id?: ObjectId;
  studentCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  birthDate: string; 
  age: number;
  address: Address;
  contactNumber: string;
  email?: string;
}
