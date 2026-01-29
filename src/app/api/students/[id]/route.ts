import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { studentSchema } from "@/schemas/studentSchema";
import { calculateAge } from "@/utils/calculateAge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("student_management");

  const student = await db
    .collection("students")
    .findOne({ _id: new ObjectId(id) });

  if (!student)
    return NextResponse.json({ error: "Student not found" }, { status: 404 });

  return NextResponse.json(student);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = studentSchema.parse(body);

  const age = calculateAge(parsed.birthDate);

  const client = await clientPromise;
  const db = client.db("student_management");

  await db.collection("students").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...parsed, age } }
  );

  return NextResponse.json({ message: "Updated successfully" });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const client = await clientPromise;
  const db = client.db("student_management");

  await db.collection("students").deleteOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json({ message: "Deleted successfully" });
}
