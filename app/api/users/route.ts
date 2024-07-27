import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '../../../lib/dbConnection';
import User from '../../../models/user.schema';
import Doiq from '@/models/doiq.schema';

// Helper function to handle errors
const handleError = (error: any) => {
  console.error(error);
  return new NextResponse(JSON.stringify({ message: 'Server error', error: error.message }), { status: 500 });
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get all users
    const users = await User.find({});
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Create a new user
    const user = new User(body);
    const doiq = await Doiq.create({ doiqValue: body.doiqValue, userId: user._id, userFid: user.fid })
    user.doiqs.push(doiq._id)
    await user.save();
    return new NextResponse(JSON.stringify(user), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Find user by id and update
    const { fid, _id, doiqValue, ...updateData } = body;
    const user = await User.findOne({ fid });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }
    const doiq = await Doiq.create({ doiqValue, userId: user._id, userFid: user.fid })
    user.doiqCount = updateData.doiqCount
    user.doiqs.push(doiq._id)
    user.save()
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Find user by id and delete
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }
    return new NextResponse(JSON.stringify({ message: 'User deleted' }), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// Specific endpoint to get a single user by ID
export async function GET_BY_ID(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    // Find user by id
    const user = await User.findOne({ fid: fid });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }
    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
