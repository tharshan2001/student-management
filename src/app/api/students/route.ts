import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { studentSchema } from "@/schemas/studentSchema";
import { generateStudentCode } from "@/utils/generateStudentCode";
import { calculateAge } from "@/utils/calculateAge";
import { Student } from "@/models/student";

// =======================
// GET – List Students
// =======================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("student_management");

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

    // ✅ Convert ObjectId → string
    const formatted = results.map((s) => ({
      ...s,
      _id: s._id.toString(),
    }));

    return NextResponse.json({
      page,
      limit,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      data: formatted,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// =======================
// POST – Create Student
// =======================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = studentSchema.parse(body);

    const client = await clientPromise;
    const db = client.db("student_management");
    const collection = db.collection("students");

    const studentCode = await generateStudentCode(collection);
    const age = calculateAge(parsed.birthDate);

    // ✅ Mongo-safe object
    const dbStudent = {
      ...parsed,
      _id: new ObjectId(), // IMPORTANT
      studentCode,
      age,
    };

    await collection.insertOne(dbStudent);

    // ✅ Return frontend-safe version
    return NextResponse.json(
      {
        ...dbStudent,
        _id: dbStudent._id.toString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create student" },
      { status: 400 }
    );
  }
}
