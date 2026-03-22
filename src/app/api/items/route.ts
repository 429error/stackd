import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    if (!categoryId) {
      return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
    }

    await dbConnect();

    const items = await Item.find({ category: categoryId, user: auth.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Get items error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { name, link, categoryId } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Item name is required" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
    }

    await dbConnect();

    const item = await Item.create({
      name: name.trim(),
      link: link?.trim() || "",
      category: categoryId,
      user: auth.userId,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Create item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
