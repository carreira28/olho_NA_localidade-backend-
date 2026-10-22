import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

const signup = async (data) =>{
    const {name, email, password} = data;

    const existUser = await prisma.cidadao.
}