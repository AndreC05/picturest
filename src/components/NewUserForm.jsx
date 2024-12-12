import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";

export default async function NewUserForm() {
    
    const { user_id } = await auth()

    async function handleSubmit(formData) {
        "use server";
        const username = formData.get("username")
        const bio = formData.get("bio")
        await db.query(`INSERT INTO users(username, bio, clerk_id) VALUES($1, $2, $3)`, [username, bio, user_id])
        
        revalidatePath("/posts")
        redirect("/posts")
    } 
    return (
        <form action={handleSubmit}>
            <label>Username :</label>
            <input required name="username" placeholder="Username" minLength={5} maxLength={50} type="text" />
            <label>Bio : </label>
            <textarea required name="bio" placeholder="bio" minLength={15} maxLength={500} type="text"></textarea>
            <button type="submit" >Submit</button>
        </form>
    )
}