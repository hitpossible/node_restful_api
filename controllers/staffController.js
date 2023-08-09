const Staff = require('../models/staff');

exports.index = async (req, res, next) => {
    const staff = await Staff.find().sort({_id: -1});
    res.status(200).json({
        data: staff
    })
}

exports.show = async (req, res, next) => {
    try {
        const {id} = req.params;
        // const staff = await Staff.findOne({_id: id}).sort({_id: -1});
        const staff = await Staff.findById(id);

        if (!staff) 
            throw new Error('Not found.');
        

        res.status(201).json({
            data: staff
        })
    } catch (error) {
        res.status(400).json({
            error: {
                message: error.message
            }
        })
    }
}

exports.destroy = async (req, res, next) => {
    try {
        const {id} = req.params;
        const staff = await Staff.deleteOne({_id: id});
        // const staff = await Staff.findByIdAndRemove(id);

        if (staff.deleteCount === 0) 
            throw new Error('ไม่สามารถลบข้อมูลได้');
        

        res.status(200).json({
            data: "ลบข้อมูลเรียบร้อย"
        })
    } catch (error) {
        res.status(400).json({
            error: {
                message: 'เกิดข้อผิดพลาด: ' + error.message
            }
        })
    }
}

exports.insert = async (req, res, next) => {

    const { name, salary } = req.body; 

    let staff = new Staff({
        name: name,
        salarty: salary
    });
    await staff.save();

    res.status(200).json({
        data: 'Inserted.'
    })
}

exports.update = async (req, res, next) => {
    try {
        const {id} = req.params;
        const { name, salary } = req.body;

        // Solution 1
        // const staff = await Staff.findById(id);
        // staff.name = name;
        // staff.salary = salary;
        // await staff.save();

        // Solution 2
        // const staff = await Staff.findByIdAndUpdate(id, {
        //     name: name,
        //     salary: salary
        // })

        //Soulution 3
        const staff = await Staff.updateOne({_id: id}, {
            name: name,
            salary: salary
        })

        if (staff.nModified === 0)
            throw new Error('ไม่สามารถแก้ไขได้');

        res.status(200).json({
            data: 'Updated.'
        })
       
    } catch (error) {
        res.status(400).json({
            error: {
                message: 'เกิดข้อผิดพลาด: ' + error.message
            }
        })
    }
}