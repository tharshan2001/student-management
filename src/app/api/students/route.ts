import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { studentSchema } from "@/schemas/studentSchema";
import { generateStudentCode } from "@/utils/generateStudentCode";
import { calculateAge } from "@/utils/calculateAge";
import { Student } from "@/models/student";

//  GET – List Students (with pagination)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("student_management");

    //  Search logic
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { studentCode: { $regex: search, $options: "i" } },
            { "address.city": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await db.collection("students").countDocuments(query);

    const results = await db
      .collection("students")
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .toArray();

    return NextResponse.json({
      page,
      limit,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      data: results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}


//  POST – Create Student
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = studentSchema.parse(body);

    const client = await clientPromise;
    const db = client.db("student_management");
    const collection = db.collection("students");

    const studentCode = await generateStudentCode(collection);
    const age = calculateAge(parsed.birthDate);

    const student: Student = {
      ...parsed,
      studentCode,
      age,
    };

    await collection.insertOne(student);

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create student" },
      { status: 400 }
    );
  }
}
