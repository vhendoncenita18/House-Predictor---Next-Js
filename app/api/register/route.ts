import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prisma";

export async function POST(request: Request) {
    try{
        const body = await request.json();

        const {
            lastName,
            middleName,
            firstName,
            gender,
            birthdate,
            username,
            password,
            confirmPassword
        } = body;

        if(!lastName || !firstName || !username || !password || !confirmPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: {username}
        });

        if(existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        
        if(password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
        }

        if(password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        const hashedpass = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                firstName,
                middleName,
                lastName,
                gender,
                birthdate: new Date(birthdate),
                username,
                password: hashedpass,
                utype: "User",
            },
        })
        
        return NextResponse.json({ message: "User registered successfully", user }, { status: 201 });
    }catch (error) {
        return NextResponse.json({ error: "An error occurred while registering the user" }, { status: 500 });
    }
}


