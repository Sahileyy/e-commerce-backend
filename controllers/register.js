import bcrypt from 'bcrypt'
import users from '../models/usersModel.js';



export async function registerUser(req, res) {
    try {
        // console.log(req.body);
        
        const { username: username,
            email: email,
            password: password,
            password2: password2
        } = req.body
        const registerData = req.body;
        // console.log(registerData);



        const username_check = await users.findOne({ username: username })
        //    console.log(username_check);

        const pass_check = await password === password2
        // console.log(pass_check);

        const hashed = await bcrypt.hash(password, 10)
        if (!username_check && pass_check) {

            const users_data = await users.insertOne({
                username: username,
                email: email,
                password: hashed,
                role: 'user',
                status: 'enable'
            })
            console.log(users_data)
          return  res.send('REGISTERED SUCCESSFULLY')

        }

        if(!username||!pass_check){
            console.log("check password not registered");
            
         return   res.send("Check PassWord not registered")
        }

          if(username||pass_check){
            console.log("Already another user taken this username");
            
         return   res.send("enter another username not registered")
        }
        



    }
    catch (error) {
        console.log(error);

    }


    
}