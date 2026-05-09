import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({}).populate("category");
        return NextResponse.json(products, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching products", error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, description, image, category, price, discount, isavailable } = body;

        if (!name || !description || !image || !category || price === undefined) {
            return NextResponse.json({ message: "Required fields are missing" }, { status: 400 });
        }

        const product = await Product.create({ name, description, image, category, price, discount, isavailable });
        return NextResponse.json({ message: "Product created", product }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error creating product", error: error.message }, { status: 500 });
    }
}
