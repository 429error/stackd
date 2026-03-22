import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await params;
    const updates = await req.json();

    await dbConnect();

    const allowedUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) allowedUpdates.name = updates.name.trim();
    if (updates.status !== undefined) allowedUpdates.status = updates.status;
    if (updates.link !== undefined) allowedUpdates.link = updates.link.trim();

    const item = await Item.findOneAndUpdate(
      { _id: id, user: auth.userId },
      allowedUpdates,
      { new: true }
    );

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Update item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await params;

    await dbConnect();

    const item = await Item.findOneAndDelete({ _id: id, user: auth.userId });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted" });
  } catch (error) {
    console.error("Delete item error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
