import { Collection } from "mongodb";

export const generateStudentCode = async (collection: Collection): Promise<string> => {
  const lastStudent = await collection.find({}).sort({ _id: -1 }).limit(1).toArray();
  if (lastStudent.length === 0) return "STU_0001";

  const lastCode = lastStudent[0].studentCode;
  const num = parseInt(lastCode.split("_")[1]) + 1;
  return `STU_${num.toString().padStart(4, "0")}`;
};
