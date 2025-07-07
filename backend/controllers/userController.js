import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req, res)=> {
 
    const validateEmail = (email)=> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return "Please enter a valid email address"
        }
        return null;
    };

    const validateName = (name)=> {
        if (name.length < 5 || name.length > 20) {
            return 'Name must be between 5 and 20 characters';
        }
        return null;
    };

    const validatePassword =(password)=> {
        if (password.length < 8 || password.length > 16) {
            return 'Password must be between 8 and 16 characters';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return 'Password must contain at least one special character';
        }
        return null;
    }

    try {
        const {username, email, password} = req.body;

        if(!email || !password || !username) {
            return res.status(400).json({message:"All fields are required"});
        }

        const nameError = validateName(username);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (nameError || emailError || passwordError) {
            return res.status(400).json({
                error: nameError || emailError || passwordError
            });
        }

        const alreadyExistingUser = await User.findOne({email});
        if(alreadyExistingUser) {
            return res.status(400).json({message:"User Already Exist"});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const createNewUser = new User({
            email,
            password: hashPassword,
            username,
        });
        await createNewUser.save();

        const token = jwt.sign({id: createNewUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn: "1d"
        })
        res.cookie("access_token", token, {
            http: true,
        }).status(200).json({message: "User registered in Successfully", createNewUser, token});
        // res.status(200).json({message:"User registered successfully",createNewUser});

    }
    catch(err) {
        console.log(error);
        res.status(400).json({message:"Error Registering user"});
    }
}


export const login = async(req, res)=> {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message:"Email & password are required"});
        }

        const user = await User.findOne({ email }).select("+password");
        if(!user) {
            return res.status(400).json({errors:"User not found"});
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword) {
            return res.status(400).json({errors:"Incorrect Password"});
        }

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET_KEY,{
            expiresIn: "1d"
        })
        res.cookie("access_token", token, {
            http: true,
        }).status(200).json({message: "User logged in Successfully", user, token});

        // res.status(201).json({message:"User logged in Successfully", user});
    }
    catch(err) {
        console.log(err);
        res.status(400).json({message:"Login Failed"});
    }
}


export const logout = (req, res)=> {
    try {
        res.clearCookie({access_token})
        res.status(200).json({success:true, message:"User logged out successfully"});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message:"Error in logging out"});
    }
}