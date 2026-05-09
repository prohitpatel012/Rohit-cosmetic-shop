import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const category = await Category.findById(id);
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }
        return NextResponse.json(category, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching category", error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const { name, description } = body;

        const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Category updated", category }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error updating category", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error deleting category", error: error.message }, { status: 500 });
    }
}
