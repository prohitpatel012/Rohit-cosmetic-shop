import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find({});
        return NextResponse.json(categories, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching categories", error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, description } = body;

        if (!name || !description) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const existCategory = await Category.findOne({ name });
        if (existCategory) {
            return NextResponse.json({ message: "Category already exists" }, { status: 400 });
        }

        const category = await Category.create({ name, description });
        return NextResponse.json({ message: "Category created", category }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error creating category", error: error.message }, { status: 500 });
    }
}
