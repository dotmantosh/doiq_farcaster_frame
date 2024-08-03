import dbConnect from '../../../lib/dbConnection';
import { User } from '../../../models/user.schema';
import { Doiq } from '../../../models/doiq.schema';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to handle errors
const handleError = (error: any) => {
  console.error(error);
  return NextResponse.json({ status: false, message: 'Server error', error: error.message, user: null });
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url)

    const fid = url.searchParams.get("fid")
    if (fid) {
      const users = await User.find({ fid: fid });
      return NextResponse.json({ users, status: true });
    }
    const users = await User.find({});
    return NextResponse.json({ users, status: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const user = new User(body);
    const doiq = await Doiq.create({ doiqValue: body.doiqValue, userId: user._id, userFid: user.fid });
    user.doiqs.push(doiq._id);
    await user.save();
    return NextResponse.json({ user, status: true });
  } catch (error) {
    return handleError(error);
  }
}
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { fid, doiqValue, doiqAnswer } = body;
    const user = await User.findOne({ fid });

    if (!user) {
      return NextResponse.json({ message: 'User not found', status: false, user: null }, { status: 404 });
    }

    const doiq = await Doiq.create({ doiqValue, doiqAnswer, userId: user._id, userFid: user.fid });
    user.doiqs.push(doiq._id);
    await user.save();
    return NextResponse.json({ status: true, user });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { _id } = await req.json();

    const user = await User.findByIdAndDelete(_id);

    if (!user) {
      return NextResponse.json({ message: 'User not found', status: false, user: null }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted', status: true });
  } catch (error) {
    return handleError(error);
  }
}
