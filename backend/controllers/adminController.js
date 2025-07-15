// api for adding doctor

const addDoctor =  async (req,res) =>{

    try {
        const {name, email, password, speciality, degree, experience, about, fee, address} = req.body
        const imageFile = req.file

        console.log({name, email, password, speciality, degree, experience, about, fee, address},imageFile);
        

    } catch (error) {
        
    }
}

export {addDoctor}