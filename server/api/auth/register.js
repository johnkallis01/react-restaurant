import bcrypt from 'bcrypt';

// router.post('/register', async (req,res)=>{
//     console.log('register')
//     const {firstName, lastName, phone, email, password} = req.body;
//     try{
//         const userExists = await User.findOne({email});
//         if(userExists) return res.status(400).json({message: 'user exisits'});
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({firstName, lastName, email, phone, password: hashedPassword});
//         res.status(201).json({_id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone})
//     }catch (error){
//         res.status(500).json(error,{message: "user didn't register"})
//     }
// });